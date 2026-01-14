/*
Websites:

- https://github.com/pmndrs/gltfjsx (GLTF JSX for 3D Models)
- https://lucide.dev/icons/ (Lucide Icons)
- https://github.com/anuraghazra/github-readme-stats (Github Readme Stats)
- https://skillicons.dev (Skill Icons to show skills)
- https://github-readme-streak-stats.herokuapp.com (Github Readme Streak Stats)

:root {
  --background: 27 27 27;
  --foreground: 225 225 225;
  --muted: 115 115 115;
  --accent: 254 254 91; #FEFE5B
}

*/

import { GithubRepoInformationsType } from "@/app/api/repo/route";
import { TBtnList, TProjectList } from "../types";

export const getProjectsData: () => Promise<TProjectList[]> = async () => {
  const resp = await fetch("/api/repo");
  const data = (await resp.json()) as GithubRepoInformationsType;
  return data.map((repo) => ({
    id: repo.id ?? 0,
    name: repo.name ?? "",
    full_name: repo.full_name ?? "",
    description: repo.description ?? "",
    date: repo.updated_at ?? new Date().toISOString(),
    language: repo.language ?? "",
    is_template: repo.is_template ?? false,
    stargazers_count: repo.stargazers_count ?? 0,
    watchers_count: repo.watchers_count ?? 0,
    html_url: repo.html_url ?? "",
    demoLink: repo.html_url ?? "",
  })) as TProjectList[];
};

export const BtnList: TBtnList[] = [
  { label: "Home", link: "/", icon: "home", newTab: false },
  { label: "About", link: "/about", icon: "about", newTab: false },
  { label: "Projects", link: "/projects", icon: "projects", newTab: false },
  { label: "Contact", link: "/contact", icon: "contact", newTab: false },
  {
    label: "Github",
    link: "https://www.github.com/cobeo2004",
    icon: "github",
    newTab: true,
  },
  {
    label: "LinkedIn",
    link: "https://www.linkedin.com/in/xuân-tuấn-minh-nguyễn-7836822b5/",
    icon: "linkedin",
    newTab: true,
  },
  {
    label: "Instagram",
    link: "https://www.instagram.com/immsimonnnn__/",
    icon: "instagram",
    newTab: true,
  },
  {
    label: "Resume",
    link: "/assets/pdf/CV.pdf",
    icon: "resume",
    newTab: true,
  },
];
