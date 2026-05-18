import { Router } from "express";
import { middlewares } from "../middleware";
import TagsAdapter from "../../application/adapters/tags.adapter";

const route = Router();

export default (app: Router) => {
  app.use("/tags", route);
  route.use(middlewares.protectedRoute);

  // GET /tags — all tags for current user with link counts
  route.get("/", TagsAdapter.getAllTags);

  // POST /tags/bulk — apply/remove tags across multiple links
  route.post("/bulk", TagsAdapter.bulkApplyTags);

  // GET /tags/links/:tagName — all links for a given tag (cross-collection)
  route.get("/links/:tagName", TagsAdapter.getLinksByTag);

  // GET /tags/:linkId — tags for a specific link
  route.get("/:linkId", TagsAdapter.getTagsForLink);

  // POST /tags/:linkId — add a tag to a link (manual, confirmed=true)
  route.post("/:linkId", TagsAdapter.addTagToLink);

  // PATCH /tags/:linkId/:tagId — confirm an auto-suggested tag
  route.patch("/:linkId/:tagId", TagsAdapter.confirmTag);

  // DELETE /tags/:linkId/:tagId — remove a tag from a link
  route.delete("/:linkId/:tagId", TagsAdapter.removeTag);
};
