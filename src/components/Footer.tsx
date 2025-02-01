import React from 'react';
import Link from 'next/link';
import { GithubIcon, LinkedinIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="px-[4%] py-6 font-manrope bg-white border-4  ">
      <div className="flex flex-col md:flex-row w-full items-center justify-between gap-4">
        <div className="font-extrabold md:text-xl text-lg">
          HushBoard
        </div>
        <h3 className='font-bold'>Made with ❤️ By Jaydeep Patil</h3>
        <div className="text-sm flex  gap-5 font-semibold text-black">
          
        <Link
            href="https://www.linkedin.com/in/jaydeep-patil-6684691ba"
            className="flex items-center gap-2 p-2 border-2 border-black  rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition"
          >
            <LinkedinIcon className="w-4 h-4" /> Linkedin
          </Link>
          <Link
            href="https://www.github.com/jaydeep3704"
            className="flex items-center gap-2 p-2 border-2 border-black bg-accent rounded-lg shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition"
          >
            <GithubIcon className="w-4 h-4" /> Github
          </Link>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
