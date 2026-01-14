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

import { TGithubRepoInformations } from "@/app/api/repo/route";
import { TBtnList, TMusic, TProjectList } from "../types";

export const getProjectsData: () => Promise<TProjectList[]> = async () => {
  const resp = await fetch("/api/repo");
  const data = (await resp.json()) as TGithubRepoInformations;
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

export const musicDb = (): TMusic[] => {
  return [
    {
      id: 1,
      name: "Zenzenzense",
      description: "OST of Kimi no Nawa (Your Name)",
      artist: "Radwimps",
      musicUrl: "/assets/music/song/zenzenzense.mp3",
      coverUrl: "/assets/music/cover/your-name.jpg",
    },
    {
      id: 2,
      name: "Nandemonaiya",
      description: "OST of Kimi no Nawa (Your Name)",
      artist: "Radwimps",
      musicUrl: "/assets/music/song/nandemonaiya.mp3",
      coverUrl: "/assets/music/cover/your-name.jpg",
    },
    {
      id: 3,
      name: "Dream Lantern",
      description: "OST of Kimi no Nawa (Your Name)",
      artist: "Radwimps",
      musicUrl: "/assets/music/song/dream-lantern.mp3",
      coverUrl: "/assets/music/cover/your-name.jpg",
    },
    {
      id: 4,
      name: "Sparkle",
      description: "OST of Kimi no Nawa (Your Name)",
      artist: "Radwimps",
      musicUrl: "/assets/music/song/sparkle.mp3",
      coverUrl: "/assets/music/cover/your-name.jpg",
    },
    {
      id: 5,
      name: "Suzume",
      description: "OST of Suzume",
      artist: "Radwimps",
      musicUrl: "/assets/music/song/suzume.mp3",
      coverUrl: "/assets/music/cover/suzume.jpg",
    },
    {
      id: 6,
      name: "Grand Escape",
      description: "OST of Weathering with You",
      artist: "Radwimps",
      musicUrl: "/assets/music/song/grand-escape.mp3",
      coverUrl: "/assets/music/cover/weathering-with-you.jpg",
    },
    {
      id: 7,
      name: "Saraba",
      description: "Opening of Blue Box Season 1",
      artist: "Macaroni Empitsu",
      musicUrl: "/assets/music/song/saraba.mp3",
      coverUrl: "/assets/music/cover/blue-box.jpg",
    },
    {
      id: 8,
      name: "Same blue",
      description: "Opening of Blue Box Season 1",
      artist: "Hige Dandism",
      musicUrl: "/assets/music/song/same-blue.mp3",
      coverUrl: "/assets/music/cover/blue-box.jpg",
    },
    {
      id: 9,
      name: "Pretender",
      description: "Famous song from Hige Dandism",
      artist: "Hige Dandism",
      musicUrl: "/assets/music/song/pretender.mp3",
      coverUrl: "/assets/music/cover/pretender.jpg",
    },
    {
      id: 10,
      name: "Fiction",
      description: "Opening of Wotakoi Season 1",
      artist: "sumika",
      musicUrl: "/assets/music/song/fiction.mp3",
      coverUrl: "/assets/music/cover/wotakoi.jpg",
    },
    {
      id: 11,
      name: "Tracing that dream",
      description: "Another famous song from Yoasobi",
      artist: "Yoasobi",
      musicUrl: "/assets/music/song/tracing-that-dream.mp3",
      coverUrl: "/assets/music/cover/yoasobi.jpg",
    },
    {
      id: 12,
      name: "Fireworks",
      description:
        "Famous song from DAOKO x Kenshi Yonezu, opening of Fireworks, and it’s even more famous than the film itself :)",
      artist: "DAOKO x Kenshi Yonezu",
      musicUrl: "/assets/music/song/fireworks.mp3",
      coverUrl: "/assets/music/cover/fireworks.jpg",
    },
    {
      id: 13,
      name: "Racing into the night",
      description:
        "Most famous song of Yoasobi, if you have not heard it then you don’t know nothing about Japan",
      artist: "Yoasobi",
      musicUrl: "/assets/music/song/racing-into-the-night.mp3",
      coverUrl: "/assets/music/cover/yoasobi.jpg",
    },
    {
      id: 14,
      name: "Setting sun",
      description:
        "Opening of Boku no Kokoro no Yabai Yatsu (The Dangers in My Heart) Season 1",
      artist: "Yorushika",
      musicUrl: "/assets/music/song/setting-sun.mp3",
      coverUrl: "/assets/music/cover/boku-no-yabai-1.jpg",
    },
    {
      id: 15,
      name: "I am",
      description:
        "Opening of Boku no Kokoro no Yabai Yatsu (The Dangers in My Heart) Season 2",
      artist: "Atarayo",
      musicUrl: "/assets/music/song/i-am.mp3",
      coverUrl: "/assets/music/cover/boku-no-yabai-2.jpg",
    },
    {
      id: 16,
      name: "Cinderella",
      description: "Opening of Komi can’t communicate Season 1",
      artist: "Cidergirl",
      musicUrl: "/assets/music/song/cinderella.mp3",
      coverUrl: "/assets/music/cover/komi.jpg",
    },
    {
      id: 17,
      name: "Silhouette",
      description: "The holy anthem of anime world, from opening 16 of Naruto.",
      artist: "Kanaboon",
      musicUrl: "/assets/music/song/silhouette.mp3",
      coverUrl: "/assets/music/cover/naruto.jpg",
    },
    {
      id: 18,
      name: "Harenohini",
      description:
        "The ending theme for Kaoru Hana wa Rin to Saku (The Fragrant Flower Blooms with Dignity)",
      artist: "Reira Ushio",
      musicUrl: "/assets/music/song/harenohini.mp3",
      coverUrl: "/assets/music/cover/kaoru-hana.jpg",
    },
    {
      id: 19,
      name: "Your gaze, Crespucular",
      description:
        "Opening of Kaoru Hana wa Rin to Saku (The Fragrant Flower Blooms with Dignity)",
      artist: "Tatsuya Hikani",
      musicUrl: "/assets/music/song/your-gaze-crespucular.mp3",
      coverUrl: "/assets/music/cover/kaoru-hana.jpg",
    },
    {
      id: 20,
      name: "Blue Bird",
      description:
        "Another holy anthem of anime world, from opening 3 of Naruto.",
      artist: "Ikimonogakari",
      musicUrl: "/assets/music/song/blue-bird.mp3",
      coverUrl: "/assets/music/cover/naruto.jpg",
    },
    {
      id: 21,
      name: "Iris Out",
      description:
        "New generation of holy anthem, from opening of Chainsaw Man - The Movie: Reze Arc",
      artist: "Kenshi Yonezu",
      musicUrl: "/assets/music/song/iris-out.mp3",
      coverUrl: "/assets/music/cover/chainsaw-man.jpg",
    },
  ];
};
