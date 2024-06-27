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

import { TBtnList, TProjectList } from "./types";

export const projectsData: TProjectList[] = [
    {
        id: 1,
        name: "ArgumentedReality",
        description: "Simple shape-placing app",
        date: "2022-03-03",
        demoLink: "https://github.com/cobeo2004/ArgumentedReality",
    },
    {
        id: 2,
        name: "PasswordGenerator",
        description: "Generating and storing passwords",
        date: "2022-04-28",
        demoLink: "https://github.com/cobeo2004/PasswordGenerator",
    },
    {
        id: 3,
        name: "Book-BackEnd",
        description: "RESTful API for storing books",
        date: "2023-07-21",
        demoLink: "https://github.com/cobeo2004/Book-BackEnd",
    },
    {
        id: 4,
        name: "GUI-Music-Player",
        description: "Ruby GUI Music Player",
        date: "2023-05-11",
        demoLink: "https://github.com/cobeo2004/GUI-Music-Player",
    },
    {
        id: 5,
        name: "COS10026",
        description: "COS10026 Assignments",
        date: "2023-03-07",
        demoLink: "https://github.com/cobeo2004/COS26-Assignment-One",
    },
    {
        id: 6,
        name: "ArrayImplementation",
        description: "Array Implementation in Java",
        date: "2024-02-16",
        demoLink: "https://github.com/cobeo2004/data-structures",
    },
    {
        id: 7,
        name: "LotteryPrediction",
        description: "Predict percentage to win lottery",
        date: "2022-08-19",
        demoLink: "https://github.com/cobeo2004/xsmb-than-tai",
    },
    {
        id: 8,
        name: "COS20031",
        description: "Relational DB with CRUD API",
        date: "2024-05-19",
        demoLink: "https://github.com/cobeo2004/COS20031",
    },
    {
        id: 9,
        name: "ProposionalLogic",
        description: "Fundamental of Proposional Logic",
        date: "2024-05-01",
        demoLink: "https://github.com/cobeo2004/Assignment2",
    },
    {
        id: 10,
        name: "Portfolio",
        description: "Responsive portfolio website",
        date: "2024-06-27",
        demoLink: "https://github.com/cobeo2004/portfolio-nextjs",
    },
];

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
        link: "/resume.pdf",
        icon: "resume",
        newTab: true,
    },
];
