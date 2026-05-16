import { Link } from "react-router";
import { paths } from "@config/paths";

const footerGroups = [
  {
    label: "Product",
    links: [
      {
        name: "Collections",
        href: paths.collections.root.getHref(),
        external: false,
      },
      { name: "Browser Extension", href: "#", external: false },
      { name: "Sign Up", href: paths.auth.root.getHref(), external: false },
      { name: "Changelog", href: "#", external: false },
    ],
  },
  {
    label: "Developer",
    links: [
      {
        name: "GitHub",
        href: "https://github.com/Keshav-Aneja/onelink",
        external: true,
      },
      { name: "API Docs", href: "#", external: false },
      {
        name: "Creator's Site",
        href: "https://keshavaneja.in",
        external: true,
      },
      { name: "Self-host guide", href: "#", external: false },
    ],
  },
  {
    label: "Legal",
    links: [
      { name: "Privacy", href: "#", external: false },
      { name: "Terms", href: "#", external: false },
      {
        name: "License (MIT)",
        href: "https://github.com/Keshav-Aneja/onelink/blob/main/LICENSE",
        external: true,
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative pt-16 pb-8 border-t border-white/10 bg-theme_primary_black">
      <div className="max-w-295 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_3fr] gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <img
                src="/images/logo.webp"
                alt="OneLink"
                className="w-6 h-auto hue-rotate-90"
              />
              <span className="text-base font-semibold">OneLink</span>
            </div>
            <p className="mt-4 text-secondary_text text-sm leading-relaxed max-w-[280px]">
              Your links. Your collections. One place.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {footerGroups.map((group, i) => (
              <div key={i}>
                <div className="text-[10.5px] uppercase tracking-[0.18em] text-secondary_text">
                  {group.label}
                </div>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link, j) =>
                    link.external ? (
                      <li key={j}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[13.5px] text-theme_secondary_white hover:text-white transition"
                        >
                          {link.name}
                        </a>
                      </li>
                    ) : (
                      <li key={j}>
                        <Link
                          to={link.href}
                          className="text-[13.5px] text-theme_secondary_white hover:text-white transition"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-5 text-center text-xs text-secondary_text">
          © 2025 OneLink · Made with <span className="text-primary">♥</span> by
          Keshav Aneja
        </div>
      </div>
    </footer>
  );
};

export default Footer;
