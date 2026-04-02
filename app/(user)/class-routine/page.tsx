import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import React from 'react'
import { FaEye } from 'react-icons/fa'

export default function page() {
    return (
        <>
            <Breadcrumbs pageTitle="ক্লাস রুটিন" />
            <div className="py-10">
                <div className="container mx-auto px-4">
                    <div className="flex gap-6 flex-wrap lg:flex-nowrap">
                        <div className="w-full lg:w-9/12">
                            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
                                <div className='p-4 lg:p-5 text-sm lg:text-base'>
                                    <div className='bg-light rounded-lg overflow-hidden relative overflow-x-auto shadow-sm'>
                                        <table className='w-full text-sm sm:text-base'>
                                            <tbody>
                                                <tr className='odd:bg-white even:bg-light text-tcolor'>
                                                    <td className='px-1 sm:px-4 py-2 sm:py-3'>
                                                        <div className='flex items-center gap-x-2'>
                                                            <div className='w-8 sm:w-10 rounded-sm overflow-hidden shadow-sm'>
                                                                <span className='block py-0 px-1 text-white text-xs sm:text-sm bg-red-500 text-center capitalize'>May</span>
                                                                <span className='block py-2 sm:py-3 px-1 text-green-950 text-sm sm:text-lg font-medium bg-white text-center capitalize leading-1'>28</span>
                                                            </div>
                                                            <div className='rotate-[270deg] -ml-3'>
                                                                <span className='text-sm sm:text-lg text-tcolor font-medium'>2025</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='px-1 sm:px-4 py-2 sm:py-3'>
                                                        <Link href="/class-routine/single-class-routine" className='inline-block transition-all hover:text-scolor'>HSC</Link>
                                                    </td>
                                                    <td className='px-1 sm:px-4 py-2 sm:py-3'><div className='flex justify-end items-center gap-x-2'><Link className='transition-all hover:text-greencolor' href="/"><FaEye className='text-xl' /></Link></div></td>
                                                </tr>
                                                <tr className='odd:bg-white even:bg-light text-tcolor'>
                                                    <td className='px-1 sm:px-4 py-2 sm:py-3'>
                                                        <div className='flex items-center gap-x-2'>
                                                            <div className='w-8 sm:w-10 rounded-sm overflow-hidden shadow-sm'>
                                                                <span className='block py-0 px-1 text-white text-xs sm:text-sm bg-red-500 text-center capitalize'>May</span>
                                                                <span className='block py-2 sm:py-3 px-1 text-green-950 text-sm sm:text-lg font-medium bg-white text-center capitalize leading-1'>13</span>
                                                            </div>
                                                            <div className='rotate-[270deg] -ml-3'>
                                                                <span className='text-sm sm:text-lg text-tcolor font-medium'>2025</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='px-1 sm:px-4 py-2 sm:py-3'>
                                                        <Link href="/" className='inline-block transition-all hover:text-scolor'>Degree</Link>
                                                    </td>
                                                    <td className='px-1 sm:px-4 py-2 sm:py-3'><div className='flex justify-end items-center gap-x-2'><Link className='transition-all hover:text-greencolor' href="/"><FaEye className='text-xl' /></Link></div></td>
                                                </tr>
                                                <tr className='odd:bg-white even:bg-light text-tcolor'>
                                                    <td className='px-1 sm:px-4 py-2 sm:py-3'>
                                                        <div className='flex items-center gap-x-2'>
                                                            <div className='w-8 sm:w-10 rounded-sm overflow-hidden shadow-sm'>
                                                                <span className='block py-0 px-1 text-white text-xs sm:text-sm bg-red-500 text-center capitalize'>May</span>
                                                                <span className='block py-2 sm:py-3 px-1 text-green-950 text-sm sm:text-lg font-medium bg-white text-center capitalize leading-1'>08</span>
                                                            </div>
                                                            <div className='rotate-[270deg] -ml-3'>
                                                                <span className='text-sm sm:text-lg text-tcolor font-medium'>2025</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='px-1 sm:px-4 py-2 sm:py-3'>
                                                        <Link href="/" className='inline-block transition-all hover:text-scolor'>BMT</Link>
                                                    </td>
                                                    <td className='px-1 sm:px-4 py-2 sm:py-3'><div className='flex justify-end items-center gap-x-2'><Link className='transition-all hover:text-greencolor' href="/"><FaEye className='text-xl' /></Link></div></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-3/12">
                            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
                                <div className='flex justify-center text-center items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                                    <h3 className='text-base sm:text-lg font-semibold text-white'>কোর্সসমূহ</h3>
                                </div>
                                <div className='p-4 lg:p-5 text-sm lg:text-base'>
                                    <ul className="space-y-2">
                                        <li><Link href="#" className="block font-medium text-base text-greencolor transition-all hover:text-greencolor">All</Link></li>
                                        <li><Link href="#" className="block font-medium text-base text-tcolor transition-all hover:text-greencolor">HSC</Link></li>
                                        <li><Link href="#" className="block font-medium text-base text-tcolor transition-all hover:text-greencolor">Degree</Link></li>
                                        <li><Link href="#" className="block font-medium text-base text-tcolor transition-all hover:text-greencolor">BMT</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
