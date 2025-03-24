import { CreateLink } from "@components/cards/create-link-card";
import { BACKEND_URL } from "@config/constants";
export const createLink = async (data: CreateLink) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/links`, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      credentials: "include",
      method: "POST",
    });

    if (!response.ok) {
      console.error("Error fetching stream:", response.statusText);
      return;
    }

    // Use the native EventSource API or create a proper SSE parser
    const reader = response.body?.getReader();
    if (!reader) {
      console.error("Failed to get reader from response body");
      return;
    }

    let buffer = "";
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      // Decode the chunk and add it to our buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete messages in the buffer
      const lines = buffer.split("\n");
      buffer = "";

      let eventData = "";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith("data: ")) {
          eventData = line.substring(6);
        } else if (line === "" && eventData) {
          // Empty line indicates the end of an event
          try {
            const parsedData = JSON.parse(eventData);
            console.log("Received event:", parsedData);

            // Handle different status messages immediately
            if (parsedData.status === "CREATED") {
              console.log("Link creation started");
              // You can emit an event or update UI here
            } else if (parsedData.status === "ADDED") {
              console.log("RSS feed added");
              // You can emit an event or update UI here
            } else if (parsedData.success === true && parsedData.link) {
              console.log("Link created successfully:", parsedData.link);
              return parsedData.link;
            }
          } catch (e) {
            console.error("Error parsing SSE data:", e);
          }

          eventData = "";
        }
      }

      // Keep any incomplete data in the buffer
      if (eventData) {
        buffer = eventData;
      }
    }
  } catch (error) {
    console.error("Error while processing the stream:", error);
  }
};
