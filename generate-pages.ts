import fs from "fs";
import path from "path";
import { navItems } from "./data/pages";



function createPage(href: string) {
  const cleanHref = href.replace(/^\/+/, "");
  const dir = path.join(__dirname, "app", cleanHref);
  fs.mkdirSync(dir, { recursive: true }); // creates folder if it doesn't exist

  const filePath = path.join(dir, "page.tsx");

  if (fs.existsSync(filePath)) {
    console.log(`Skipped (already exists): ${filePath}`);
    return; // skip if file exists
  }

  const content = `import Upcomming from "@/components/upcomming";

export default function page() {
  return <Upcomming />
}`;
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
}

// Generate pages
navItems.forEach((item) => {
  createPage(item.href);
  item.submenu?.forEach((sub) => {
    createPage(item.href + sub.href);
  });
});

