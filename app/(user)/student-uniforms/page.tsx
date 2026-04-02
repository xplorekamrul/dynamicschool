import { BookOpen, CheckCircle, Shirt, Users } from "lucide-react";
import Image from "next/image";

export default function page() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-card to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white leading-tight">
                স্কুল ইউনিফর্ম নীতি
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-balance leading-tight">অফিসিয়াল স্কুল ইউনিফর্ম</h1>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed space-y-2.5">
                আমাদের বিদ্যালয়ের ইউনিফর্ম শিক্ষার্থীদের পরিচ্ছন্ন, সুশৃঙ্খল এবং সমানভাবে উপস্থাপন করতে সহায়তা করে। ইউনিফর্মে রয়েছে খয়েরি জামা ও সাদা পাজামা, সাথে খয়েরি বেল্ট, সাদা ওড়না ও সাদা স্কার্ফ। শিক্ষার্থীরা সাদা কেস ব্যবহার করে, আর শীতকালে খয়েরি ফুলহাতা সোয়েটার পরিধান করে। এই পোশাক বিদ্যালয়ের গর্ব বৃদ্ধি করার পাশাপাশি একটি মনোযোগী ও ইতিবাচক শিক্ষার পরিবেশ তৈরি করতে সাহায্য করে। প্রয়োজনে পোশাকে কোনো পরিবর্তন হলে তা অভিভাবক ও শিক্ষার্থীদের দ্রুত জানানো হবে।
                <br/>
                <span className="text-base font-semibold text-gray-950">
                  বিঃ দ্রঃ: প্রয়োজনে পোশাকে কোনো পরিবর্তন হলে তা অভিভাবক ও শিক্ষার্থীদের দ্রুত জানানো হবে।
                </span>
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-card border border-border shadow-lg">
                <Image
                  src="/muhsin/dress.jpg"
                  alt="অফিসিয়াল স্কুল ইউনিফর্ম - লাল কলার সহ সাদা ব্লাউজ এবং প্লিটেড লাল স্কার্ট"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dress Code Details */}
      <section id="dress-code" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-card-foreground">ইউনিফর্মের প্রয়োজনীয়তা</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-green-500" />
                    মেয়েদের ইউনিফর্মের উপাদান
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      খয়েরি জামা, সাদা পাজামা, খয়েরি বেল্ট, সাদা ওড়না, সাদা স্কার্ফ।
                    </li>
                    {/* <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      
                    </li> */}
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      সাদা কেস।
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      শীত কালে খয়েরি সোয়েটার ফুলহাতা।
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">ইউনিফর্মের নির্দেশনা</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• ইউনিফর্ম অবশ্যই পরিষ্কার এবং সুন্দরভাবে রক্ষণাবেক্ষণ করতে হবে</li>
                    <li>• স্কার্ট উপযুক্ত দৈর্ঘ্যের হতে হবে (হাঁটুতে বা নিচে)</li>
                    <li>• চুল পরিপাটি এবং গোছানো থাকতে হবে</li>
                    <li>• সর্বনিম্ন গহনা পরিধান করা যাবে</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">যত্নের নির্দেশনা</h3>
                  <p className="text-muted-foreground">
                    ঠান্ডা পানিতে মেশিনে ধুয়ে নিন, কম তাপে টাম্বল ড্রাই করুন। প্রয়োজনে মাঝারি তাপমাত্রায় ইস্ত্রি করুন। সঠিক যত্ন নিশ্চিত করে যে
                    ইউনিফর্ম সারা স্কুল বছর জুড়ে তার চেহারা বজায় রাখে।
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-green-50 border border-border rounded-lg shadow-sm">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">ইউনিফর্ম নীতি</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">সকল শিক্ষার্থীর জন্য বাধ্যতামূলক</p>
                        <p className="text-muted-foreground">৬ম-১২শ শ্রেণির শিক্ষার্থীদের প্রতিদিন সম্পূর্ণ ইউনিফর্ম পরতে হবে</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">একাডেমিক ফোকাস</p>
                        <p className="text-muted-foreground">ইউনিফর্ম বিভ্রান্তি কমাতে এবং শিক্ষাকে উৎসাহিত করতে সাহায্য করে</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">স্কুলের গর্ব</p>
                        <p className="text-muted-foreground">আমাদের স্কুলের মূল্যবোধ এবং সম্প্রদায়ের প্রতিনিধিত্ব করে</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-green-100 rounded-lg">
                    <p className="text-sm text-center">
                      <strong>ইউনিফর্ম নীতি সম্পর্কে প্রশ্ন আছে?</strong>
                      <br />
                      স্কুল অফিসে যোগাযোগ করুন (৫৫৫) ১২৩-৪৫৬৭
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-card-foreground">আমাদের ইউনিফর্ম নীতির সুবিধা</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg shadow-sm text-center">
              <div className="p-6">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">সমতা প্রচার করে</h3>
                <p className="text-muted-foreground">
                  ইউনিফর্ম সামাজিক চাপ কমাতে এবং সকল শিক্ষার্থীর জন্য একটি অন্তর্ভুক্তিমূলক পরিবেশ তৈরি করতে সাহায্য করে।
                </p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg shadow-sm text-center">
              <div className="p-6">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">মনোযোগ বৃদ্ধি করে</h3>
                <p className="text-muted-foreground">
                  পোশাকের বিভ্রান্তি দূর করে, শিক্ষার্থীরা তাদের পড়াশোনায় আরও ভালোভাবে মনোনিবেশ করতে পারে।
                </p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg shadow-sm text-center">
              <div className="p-6">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2">স্কুলের পরিচয়</h3>
                <p className="text-muted-foreground">
                  ইউনিফর্ম স্কুলের চেতনা বৃদ্ধি করে এবং শিক্ষার্থীদের আমাদের একাডেমিক সম্প্রদায়ের অংশ হিসেবে অনুভব করতে সাহায্য করে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}