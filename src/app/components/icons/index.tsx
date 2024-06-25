import {
  Github,
  HomeIcon,
  House,
  Linkedin,
  NotebookIcon,
  Palette,
  Phone,
  Twitter,
  User,
} from "lucide-react";
export default function getIcon(icon: string) {
  switch (icon) {
    case "home":
      return <House strokeWidth={1.5} className="w-auto h-auto" />;
    case "about":
      return <User strokeWidth={1.5} className="w-auto h-auto" />;
    case "projects":
      return <Palette strokeWidth={1.5} className="w-auto h-auto" />;
    case "contact":
      return <Phone strokeWidth={1.5} className="w-auto h-auto" />;
    case "github":
      return <Github strokeWidth={1.5} className="w-auto h-auto" />;
    case "twitter":
      return <Twitter strokeWidth={1.5} className="w-auto h-auto" />;
    case "linkedin":
      return <Linkedin strokeWidth={1.5} className="w-auto h-auto" />;
    case "resume":
      return <NotebookIcon strokeWidth={1.5} className="w-auto h-auto" />;
    default:
      return <HomeIcon strokeWidth={1.5} className="w-auto h-auto" />;
  }
}
