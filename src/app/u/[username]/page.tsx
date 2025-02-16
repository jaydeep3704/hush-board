"use client";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "next/dist/server/api-utils";
const page = () => {
  const pathName = usePathname();
  const splitPath = pathName.split("/");
  const username = splitPath[2];
  const form = useForm();

  const { register, handleSubmit } = form;

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (data: any) => {
    const { content } = data;
    setIsLoading(true);
    if (!content) {
      setIsLoading(false)
      return toast({
        title: "content is required",
      });
    }
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content,
      });
      toast({
        title: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <Navbar />
      <div className="px-[8%] mt-10 ">
        <h1 className="text-2xl">Send an anonymous message to {username}</h1>
        <form
          className="mt-4 flex  md:w-[70%] w-full  flex-col"
          onSubmit={handleSubmit(sendMessage)}
        >
          <textarea
            placeholder="Type your message here "
            className="w-full outline-none rounded-2xl border p-5 border-black dark:bg-saas-foreground dark:border-none"
            rows={5}
            {...register("content")}
          />
          <button
            className="mt-5 md:w-1/2 font-semibold text-white  bg-neon-orange dark:bg-neon-green  py-3  px-8 text-md rounded-xl flex items-center justify-center gap-5"
            type="submit"
            disabled={isLoading}
          >
            {!isLoading ? (
              <span className="flex items-center justify-center gap-3">
                {" "}
                Send Message <Send className="w-5 h-5" />
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3" >
                Loading <Loader2 className="animate-spin h-5 w-5" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
