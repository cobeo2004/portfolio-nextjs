/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import AboutLayout from "./about.layout";
import GithubCalendar from "react-github-calendar";

const AboutDetails = () => {
  return (
    <section className="py-20 w-full z-10">
      <div className="grid grid-cols-12 gap-4 xs:gap-6 md:gap-8 w-full">
        <AboutLayout className="col-span-full lg:col-span-8 row-span-2 flex-col items-start">
          <>
            <h2 className="text-xl md:text-2xl text-left w-full capitalize">
              Everything about the wizard!
            </h2>
            <p className="font-light text-xs sm:text-sm md:text-base">
              Simon, a 21-year-old Vietnamese student, is immersed in the world
              of programming and technology. He is currently enrolled at
              Swinburne University of Technology, pursuing a Bachelor's degree
              in Artificial Intelligence and Cybersecurity. Simon's academic
              focus lies at the intersection of advanced computing and security,
              equipping him with the skills to tackle complex technological
              challenges.His educational journey is centered around learning the
              intricacies of AI, from machine learning algorithms to neural
              networks, and understanding the critical aspects of cybersecurity,
              including ethical hacking, cryptography, and network security.
              Simon's coursework likely involves hands-on projects and practical
              applications, allowing him to apply theoretical knowledge to
              real-world scenarios.
            </p>
          </>
        </AboutLayout>
        <AboutLayout className="col-span-full xs:col-span-6 lg:col-span-4 text-accent">
          <p className="font-semibold w-full text-left text-2xl sm:text-5xl">
            20+ <sub className="font-semibold text-2xl">Years</sub>
          </p>
        </AboutLayout>
        <AboutLayout className="col-span-full xs:col-span-6 lg:col-span-4 text-accent">
          <p className="font-semibold w-full text-left text-2xl sm:text-5xl">
            5+ <sub className="font-semibold text-2xl">Projects</sub>
          </p>
        </AboutLayout>
        <AboutLayout className="col-span-full sm:col-span-6 md:col-span-4 !p-0">
          <img
            src={`${process.env.NEXT_PUBLIC_README_STATS}/api/top-langs/?username=cobeo2004&show_icons=true&theme=transparent&hide_border=true&title_color=FEFE5B&icon_color=FEFE5B&text_color=FFFFFF&text_bold=false`}
            alt="most-used-langs"
            loading="lazy"
            className="w-full h-auto"
          />
        </AboutLayout>
        <AboutLayout className="col-span-full md:col-span-8 !p-0">
          <img
            src={`${process.env.NEXT_PUBLIC_README_STATS}/api?username=cobeo2004&show_icons=true&theme=transparent&hide_border=true&title_color=FEFE5B&icon_color=FEFE5B&text_color=FFFFFF&text_bold=false`}
            alt="stats"
            loading="lazy"
            className="w-full h-auto"
          />
        </AboutLayout>
        <AboutLayout className="col-span-full !p-0">
          <img
            src="https://skillicons.dev/icons?i=html,css,js,ts,react,aws,java,nodejs,flutter,vim,docker,git,kubernetes,c,cpp,cs,anaconda,androidstudio,apollo,apple,arduino,babel,bash,bun,cloudflare,codepen,d3,dart,discord,discordjs,electron,express,fastapi,firebase,flask,github,githubactions,gmail,go,graphql,heroku,htmx,idea,jenkins,jest,kali,lua,md,matlab,mongodb,mysql,neovim,nestjs,nextjs,notion,npm,opencv,p5js,php,prisma,pycharm,py,pytorch,rabbitmq,redux,ruby,sqlite,sklearn,selenium,solidity,swift,tensorflow,threejs,unity,vercel,vscode,vite"
            alt="langs"
            loading="lazy"
            className="w-full h-auto"
          />
        </AboutLayout>
        <AboutLayout className="col-span-full md:col-span-6 !p-0">
          <img
            src="https://streak-stats.demolab.com/?user=cobeo2004"
            alt="streaks"
            loading="lazy"
            className="w-full h-auto"
          />
        </AboutLayout>
        <AboutLayout className="col-span-full md:col-span-6 !p-0">
          <img
            src={`${process.env.NEXT_PUBLIC_README_STATS}/api/pin/?username=cobeo2004&repo=ticket-hunter&show_icons=true&theme=transparent&hide_border=true&title_color=FEFE5B&icon_color=FEFE5B&text_color=FFFFFF&text_bold=false&description_lines_count=2`}
            alt="stats"
            loading="lazy"
            className="w-full h-auto"
          />
        </AboutLayout>
        <AboutLayout className="col-span-full !p-0">
          <div className="w-full h-auto flex justify-center items-center px-2 py-6">
            <GithubCalendar
              username="cobeo2004"
              fontSize={16}
              blockSize={16}
              blockMargin={5}
            />
          </div>
        </AboutLayout>
      </div>
    </section>
  );
};

export default AboutDetails;
