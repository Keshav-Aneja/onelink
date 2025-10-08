import { ReactNode } from "react";
interface Props {
  children?: ReactNode;
}
const Mascot = ({ children }: Props) => {
  return (
    <div className="flex flex-col md:gap-4 items-center justify-center">
      <div className="w-[14rem] h-[12rem] relative left-1 scale-40 md:scale-75">
        <div className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[2rem] h-[12rem]">
            <div className="w-[1rem] h-[6rem] bg-primary absolute top-0  rounded-[100%]"></div>
            <div className="w-[1rem] h-[6rem] bg-primary absolute top-[6rem]  rounded-[100%]"></div>
          </div>
          <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2rem] h-[12rem]">
            <div className="w-[1rem] h-[6rem] bg-primary absolute top-0  rounded-[100%] rotate-90 origin-bottom"></div>
            <div className="w-[1rem] h-[6rem] bg-primary absolute top-[6rem]  rounded-[100%] rotate-90 origin-top"></div>
          </div>
        </div>
        <div className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[2rem] h-[12rem]">
            <div className="w-[1rem] h-[6rem] bg-primary absolute top-0  rounded-[100%] rotate-45 origin-bottom"></div>
            <div className="w-[1rem] h-[6rem] bg-primary absolute top-[6rem]  rounded-[100%] rotate-45 origin-top"></div>
          </div>
          <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2rem] h-[12rem]">
            <div className="w-[1rem] h-[6rem] bg-primary absolute top-0  rounded-[100%] -rotate-45 origin-bottom"></div>
            <div className="w-[1rem] h-[6rem] bg-primary absolute top-[6rem]  rounded-[100%] -rotate-45 origin-top"></div>
          </div>
        </div>
        <div className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[2rem] h-[12rem]">
            <div className="w-[0.5rem] h-[5rem] bg-primary absolute animate-pulse duration-100 delay-100  top-[1.1rem]  rounded-[100%] rotate-[67deg] origin-bottom"></div>
            <div className="w-[0.5rem] h-[5rem] bg-primary absolute animate-pulse duration-100 top-[6.1rem]  rounded-[100%] rotate-[67deg] origin-top"></div>
          </div>
          <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2rem] h-[12rem]">
            <div className="w-[0.5rem] h-[5rem] bg-primary absolute animate-pulse duration-100 delay-100 top-[0.9rem]  rounded-[100%] -rotate-[67deg] origin-bottom"></div>
            <div className="w-[0.5rem] h-[5rem] bg-primary absolute  animate-pulse duration-100 top-[5.9rem]  rounded-[100%] -rotate-[67deg] origin-top"></div>
          </div>
        </div>
        <div className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[2rem] h-[12rem]">
            <div className="w-[0.5rem] h-[5rem] bg-primary absolute animate-pulse duration-100  delay-100 top-[1.5rem]  rounded-[100%] rotate-[22deg] origin-bottom"></div>
            <div className="w-[0.5rem] h-[5rem] bg-primary absolute animate-pulse duration-100 top-[6.5rem]  rounded-[100%] rotate-[22deg] origin-top"></div>
          </div>
          <div className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2rem] h-[12rem]">
            <div className="w-[0.5rem] h-[5rem] bg-primary absolute animate-pulse duration-100 top-[0.4rem]  rounded-[100%] -rotate-[22deg] origin-bottom"></div>
            <div className="w-[0.5rem] h-[5rem] bg-primary absolute  animate-pulse duration-100 delay-100 top-[5.4rem]  rounded-[100%] -rotate-[22deg] origin-top"></div>
          </div>
        </div>
      </div>
      <p
        role="alert"
        className="text-theme_secondary_white text-sm md:text-xl -mt-8 md:mt-0"
      >
        {children}
      </p>
    </div>
  );
};

export default Mascot;
