"use client";

import { submitContactForm } from "@/actions/public/contact-form";
import { contactFormSchema, type ContactFormData } from "@/schema/contact-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
        mode: "onChange"
    });

    // Watch field values for character counting
    const nameValue = watch("name", "");
    const emailValue = watch("email", "");
    const messageValue = watch("message", "");

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);

        try {
            const result = await submitContactForm(data);

            if (result?.success) {
                toast.success(result.message);
                reset(); // Clear the form
            } else {
                toast.error(result?.error || "An error occurred while submitting your message.");
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
            <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>Feel free to drop us a line!</h3>
            </div>
            <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        {/* Name Field */}
                        <div className="mb-5">
                            <div className="relative">
                                <input
                                    {...register("name")}
                                    className={`w-full border px-5 py-2 h-11 rounded-md ${errors.name ? 'border-red-500' : 'border-[#d8e2ef]'
                                        }`}
                                    type="text"
                                    placeholder="Your Name *"
                                    disabled={isSubmitting}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <div className="text-xs text-gray-500">
                                        {nameValue.length}/100 characters
                                    </div>
                                    {errors.name && (
                                        <span className="text-red-500 text-xs">{errors.name.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div className="mb-5">
                            <input
                                {...register("phoneNumber")}
                                className={`w-full border px-5 py-2 h-11 rounded-md ${errors.phoneNumber ? 'border-red-500' : 'border-[#d8e2ef]'
                                    }`}
                                type="tel"
                                placeholder="Your Phone Number * (e.g., 01712345678)"
                                disabled={isSubmitting}
                            />
                            {errors.phoneNumber && (
                                <span className="text-red-500 text-xs mt-1 block">{errors.phoneNumber.message}</span>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="mb-5">
                            <div className="relative">
                                <input
                                    {...register("email")}
                                    className={`w-full border px-5 py-2 h-11 rounded-md ${errors.email ? 'border-red-500' : 'border-[#d8e2ef]'
                                        }`}
                                    type="email"
                                    placeholder="Email Address (optional)"
                                    disabled={isSubmitting}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <div className="text-xs text-gray-500">
                                        {(emailValue || "").length}/100 characters
                                    </div>
                                    {errors.email && (
                                        <span className="text-red-500 text-xs">{errors.email.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Message Field */}
                        <div className="mb-4">
                            <div className="relative">
                                <textarea
                                    {...register("message")}
                                    className={`w-full border px-5 py-2 h-[170px] rounded-md resize-none ${errors.message ? 'border-red-500' : 'border-[#d8e2ef]'
                                        }`}
                                    placeholder="Type your message here (optional)"
                                    disabled={isSubmitting}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <div className="text-xs text-gray-500">
                                        {(messageValue || "").length}/1000 characters
                                    </div>
                                    {errors.message && (
                                        <span className="text-red-500 text-xs">{errors.message.message}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex px-6 py-2 rounded-lg bg-pcolor text-white text-base font-medium text-center justify-center items-center gap-x-2 transition-all hover:bg-greencolor cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    "Send message"
                                )}
                            </button>
                        </div>

                        {/* Required fields note */}
                        <div className="mt-3">
                            <p className="text-xs text-gray-500">
                                * Required fields
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
