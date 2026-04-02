
export default function page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
            {/* Hero Section */}
            <section className="py-16 bg-gradient-to-r from-green-500 to-green-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">মাধ্যমিক শিক্ষাক্রম</h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                        ৬ষ্ঠ থেকে ১০ম শ্রেণি পর্যন্ত আধুনিক ও বিজ্ঞানভিত্তিক শিক্ষা ব্যবস্থা
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
                        <p className="text-lg">
                            জাতীয় শিক্ষাক্রম অনুসরণ করে সুশিক্ষিত ও দক্ষ নাগরিক গড়ে তোলার লক্ষ্যে আমাদের মাধ্যমিক শিক্ষা কার্যক্রম
                        </p>
                    </div>
                </div>
            </section>

            {/* Class Structure */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">শ্রেণি বিভাগ</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Junior Secondary */}
                        <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
                            <h3 className="text-xl font-bold text-blue-600 mb-4">নিম্ন মাধ্যমিক</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">৬ষ্ঠ শ্রেণি</span>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">১১-১২ বছর</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">৭ম শ্রেণি</span>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">১২-১৩ বছর</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">৮ম শ্রেণি</span>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">১৩-১৪ বছর</span>
                                </div>
                            </div>
                        </div>

                        {/* Upper Secondary */}
                        <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
                            <h3 className="text-xl font-bold text-green-600 mb-4">উচ্চ মাধ্যমিক</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">৯ম শ্রেণি</span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">১৪-১৫ বছর</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">১০ম শ্রেণি</span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">১৫-১৬ বছর</span>
                                </div>
                                <div className="mt-4 p-3 bg-green-50 rounded">
                                    <p className="text-sm text-green-700 font-medium">এসএসসি পরীক্ষার প্রস্তুতি</p>
                                </div>
                            </div>
                        </div>

                        {/* Academic Year */}
                        <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-500">
                            <h3 className="text-xl font-bold text-purple-600 mb-4">শিক্ষাবর্ষ</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">সেশন শুরু</span>
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">জানুয়ারি</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">বার্ষিক পরীক্ষা</span>
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">নভেম্বর</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">ছুটির দিন</span>
                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">ডিসেম্বর</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Curriculum Subjects */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">বিষয়সমূহ</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Compulsory Subjects */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-2xl font-bold text-blue-600 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-blue-600 font-bold">১</span>
                                </span>
                                বাধ্যতামূলক বিষয়
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <h4 className="font-semibold text-blue-800">বাংলা</h4>
                                    <p className="text-sm text-blue-600">১ম ও ২য় পত্র</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <h4 className="font-semibold text-blue-800">ইংরেজি</h4>
                                    <p className="text-sm text-blue-600">১ম ও ২য় পত্র</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <h4 className="font-semibold text-blue-800">গণিত</h4>
                                    <p className="text-sm text-blue-600">সাধারণ গণিত</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <h4 className="font-semibold text-blue-800">বিজ্ঞান</h4>
                                    <p className="text-sm text-blue-600">সাধারণ বিজ্ঞান</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <h4 className="font-semibold text-blue-800">ধর্ম</h4>
                                    <p className="text-sm text-blue-600">ইসলাম/হিন্দু/খ্রিস্টান/বৌদ্ধ</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <h4 className="font-semibold text-blue-800">সামাজিক বিজ্ঞান</h4>
                                    <p className="text-sm text-blue-600">ইতিহাস ও ভূগোল</p>
                                </div>
                            </div>
                        </div>

                        {/* Optional Subjects */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-2xl font-bold text-green-600 mb-6 flex items-center">
                                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-green-600 font-bold">২</span>
                                </span>
                                ঐচ্ছিক বিষয়
                            </h3>
                            <div className="space-y-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-green-800 mb-2">বিজ্ঞান বিভাগ</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="bg-white px-2 py-1 rounded">পদার্থবিজ্ঞান</span>
                                        <span className="bg-white px-2 py-1 rounded">রসায়ন</span>
                                        <span className="bg-white px-2 py-1 rounded">জীববিজ্ঞান</span>
                                        <span className="bg-white px-2 py-1 rounded">উচ্চতর গণিত</span>
                                    </div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-green-800 mb-2">মানবিক বিভাগ</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="bg-white px-2 py-1 rounded">অর্থনীতি</span>
                                        <span className="bg-white px-2 py-1 rounded">পৌরনীতি</span>
                                        <span className="bg-white px-2 py-1 rounded">ভূগোল</span>
                                        <span className="bg-white px-2 py-1 rounded">ইতিহাস</span>
                                    </div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-green-800 mb-2">ব্যবসায় শিক্ষা</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="bg-white px-2 py-1 rounded">হিসাববিজ্ঞান</span>
                                        <span className="bg-white px-2 py-1 rounded">ব্যবসায় উদ্যোগ</span>
                                        <span className="bg-white px-2 py-1 rounded">ফিন্যান্স</span>
                                        <span className="bg-white px-2 py-1 rounded">মার্কেটিং</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Assessment System */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">মূল্যায়ন ব্যবস্থা</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center border-t-4 border-yellow-500">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-yellow-600">৩০%</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">ধারাবাহিক মূল্যায়ন</h3>
                            <p className="text-gray-600">ক্লাস টেস্ট, হোমওয়ার্ক, প্রজেক্ট ও উপস্থিতি</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 text-center border-t-4 border-orange-500">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-orange-600">৭০%</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">সামষ্টিক মূল্যায়ন</h3>
                            <p className="text-gray-600">অর্ধবার্ষিক ও বার্ষিক পরীক্ষা</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 text-center border-t-4 border-red-500">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-red-600">A+</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">গ্রেডিং সিস্টেম</h3>
                            <p className="text-gray-600">A+ থেকে F পর্যন্ত গ্রেড প্রদান</p>
                        </div>
                    </div>

                    {/* Grade Scale */}
                    <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">গ্রেড স্কেল</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="font-bold text-green-600">A+</div>
                                <div className="text-sm text-gray-600">৮০-১০০</div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="font-bold text-blue-600">A</div>
                                <div className="text-sm text-gray-600">৭০-৭৯</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                <div className="font-bold text-purple-600">A-</div>
                                <div className="text-sm text-gray-600">৬০-৬৯</div>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                <div className="font-bold text-yellow-600">B</div>
                                <div className="text-sm text-gray-600">৫০-৫৯</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                                <div className="font-bold text-orange-600">C</div>
                                <div className="text-sm text-gray-600">৪০-৪৯</div>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                <div className="font-bold text-red-600">D</div>
                                <div className="text-sm text-gray-600">৩৩-৩৯</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <div className="font-bold text-gray-600">F</div>
                                <div className="text-sm text-gray-600">০-৩২</div>
                            </div>
                            <div className="text-center p-3 bg-gray-100 rounded-lg">
                                <div className="font-bold text-gray-600">GPA</div>
                                <div className="text-sm text-gray-600">৫.০০</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Extra Curricular */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">সহশিক্ষা কার্যক্রম</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-blue-600 font-bold">🏆</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">খেলাধুলা</h3>
                            <p className="text-sm text-gray-600">ফুটবল, ক্রিকেট, ব্যাডমিন্টন, দাবা</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-green-600 font-bold">🎭</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">সাংস্কৃতিক</h3>
                            <p className="text-sm text-gray-600">নাটক, গান, নৃত্য, আবৃত্তি</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-purple-600 font-bold">🔬</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">বিজ্ঞান ক্লাব</h3>
                            <p className="text-sm text-gray-600">পরীক্ষা-নিরীক্ষা, প্রজেক্ট, মেলা</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-red-600 font-bold">📚</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">বিতর্ক ক্লাব</h3>
                            <p className="text-sm text-gray-600">বিতর্ক প্রতিযোগিতা, বক্তৃতা</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Facilities */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">সুবিধাসমূহ</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-bold text-blue-600 mb-4">শ্রেণিকক্ষ</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    আধুনিক আসবাবপত্র
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    প্রজেক্টর সুবিধা
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                    পর্যাপ্ত আলো-বাতাস
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-bold text-green-600 mb-4">গবেষণাগার</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    পদার্থবিজ্ঞান ল্যাব
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    রসায়ন ল্যাব
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                    জীববিজ্ঞান ল্যাব
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-bold text-purple-600 mb-4">গ্রন্থাগার</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                    ১০,০০০+ বই
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                    পত্রিকা ও জার্নাল
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                    পড়ার পরিবেশ
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-bold text-orange-600 mb-4">কম্পিউটার ল্যাব</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                    ৫০টি কম্পিউটার
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                    ইন্টারনেট সুবিধা
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                    প্রোগ্রামিং শিক্ষা
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-bold text-red-600 mb-4">খেলার মাঠ</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                    ফুটবল মাঠ
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                    ক্রিকেট পিচ
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                    ব্যাডমিন্টন কোর্ট
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-bold text-teal-600 mb-4">অন্যান্য</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                                    অডিটোরিয়াম
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                                    ক্যান্টিন
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                                    প্রার্থনা কক্ষ
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
