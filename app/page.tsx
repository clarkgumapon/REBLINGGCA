"use client"

import Link from "next/link"
import { Dumbbell, ArrowRight, Users, Flame, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Niel's Fitness</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">
              About
            </Link>
            <Link href="#plans" className="text-sm hover:text-primary transition-colors">
              Plans
            </Link>
            <Link href="/contact" className="text-sm hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10" asChild>
              <Link href="/register">Register</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
          alt="Gym equipment"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Niel&apos;s Fitness Gym</h1>
          <p className="text-xl md:text-2xl mb-8">Your journey to a healthier lifestyle starts here</p>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Join Now <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px]">
              <Image
                src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77"
                alt="Our gym"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">About Our Gym</h2>
              <p className="text-muted-foreground mb-6">
                Since 2015, Niel&apos;s Fitness Gym has grown from a small local gym to one of
                the most well-equipped fitness facilities in Manila. Our mission is to provide a
                welcoming and motivating environment where people of all fitness levels can achieve their
                health and wellness goals.
              </p>
              <p className="text-muted-foreground">
                At Niel&apos;s Fitness Gym, it&apos;s not just about physical strength, but also about
                mental well-being and being part of a supportive community. That&apos;s why we focus
                on creating an inclusive atmosphere where members feel motivated and
                supported throughout their fitness journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Our Team</h2>
          <p className="text-center text-muted-foreground mb-12">
            Meet the experts who will guide your fitness journey
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "John Smith",
                role: "Head Trainer",
                image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
                description: "Certified personal trainer with over 10 years of experience in strength training and nutrition coaching."
              },
              {
                name: "Sarah Johnson",
                role: "Yoga Instructor",
                image: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
                description: "Certified yoga instructor specializing in vinyasa flow and meditation techniques."
              },
              {
                name: "Mike Wilson",
                role: "CrossFit Coach",
                image: "https://images.unsplash.com/photo-1533681904393-9ab6eee7e408",
                description: "CrossFit Level 2 trainer with expertise in functional fitness and mobility work."
              },
              {
                name: "Emily Chen",
                role: "Nutritionist",
                image: "https://images.unsplash.com/photo-1548690312-e3b507d8c110",
                description: "Registered dietitian with a focus on sports nutrition and meal planning."
              }
            ].map((trainer, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={trainer.image}
                    alt={trainer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{trainer.name}</h3>
                  <p className="text-primary mb-2">{trainer.role}</p>
                  <p className="text-muted-foreground text-sm">{trainer.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">What Our Members Say</h2>
          <p className="text-center text-muted-foreground mb-12">
            Real stories from our valued members
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Santos",
                image: "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0",
                text: "I've been a member for 6 months and the transformation has been incredible. The trainers are knowledgeable and supportive.",
                rating: 5
              },
              {
                name: "David Lee",
                image: "https://images.unsplash.com/photo-1563685442337-f8d7f9f6b682",
                text: "The facilities are top-notch and the community is so welcoming. Best gym I've ever been to!",
                rating: 5
              },
              {
                name: "Anna Garcia",
                image: "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3",
                text: "The nutrition guidance and personal training have helped me achieve goals I never thought possible.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
              />
            </div>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <div className="flex gap-1">
                        {Array(testimonial.rating).fill(0).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose Niel's Fitness?</h2>
            <p className="text-gray-600 mt-2">Experience the difference with our premium facilities</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <Dumbbell className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Modern Equipment</h3>
              <p className="text-gray-600">
                State-of-the-art fitness equipment for all your workout needs, regularly maintained and updated.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Expert Trainers</h3>
              <p className="text-gray-600">
                Certified fitness professionals to guide your fitness journey with personalized training plans.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <Calendar className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Diverse Classes</h3>
              <p className="text-gray-600">
                From HIIT to yoga, we offer a wide range of fitness classes for all levels and interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Membership Plans</h2>
            <p className="text-gray-600 mt-2">Choose the plan that fits your fitness journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <h3 className="text-xl font-bold mb-2">Monthly</h3>
              <p className="text-4xl font-bold mb-4">₱500</p>
              <p className="text-gray-600 mb-6">Perfect for those just starting their fitness journey</p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <Flame className="h-5 w-5 text-primary mr-2" />
                  <span>Full gym access</span>
                </li>
                <li className="flex items-center">
                  <Flame className="h-5 w-5 text-primary mr-2" />
                  <span>2 group classes per week</span>
                </li>
                <li className="flex items-center">
                  <Flame className="h-5 w-5 text-primary mr-2" />
                  <span>Locker access</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/register?plan=monthly">Get Started</Link>
              </Button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-2 border-primary">
              <div className="bg-primary text-white text-xs font-bold uppercase py-1 px-2 rounded-full inline-block mb-4">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Quarterly</h3>
              <p className="text-4xl font-bold mb-4">₱1,300</p>
              <p className="text-gray-600 mb-6">Great value for committed fitness enthusiasts</p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <Flame className="h-5 w-5 text-primary mr-2" />
                  <span>Full gym access</span>
                </li>
                <li className="flex items-center">
                  <Flame className="h-5 w-5 text-primary mr-2" />
                  <span>Unlimited group classes</span>
                </li>
                <li className="flex items-center">
                  <Flame className="h-5 w-5 text-primary mr-2" />
                  <span>1 free personal training session</span>
                </li>
                <li className="flex items-center">
                  <Flame className="h-5 w-5 text-primary mr-2" />
                  <span>Locker access</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/register?plan=quarterly">Get Started</Link>
              </Button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <h3 className="text-xl font-bold mb-2">Annual</h3>
              <p className="text-4xl font-bold mb-4">₱5,000</p>
              <p className="text-gray-600 mb-6">Best value for dedicated fitness enthusiasts</p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <Flame className="h-5 w-5 text-primary mr-2" />
                  <span>Full gym access</span>
                </li>
                <li className="flex items-center">
                  <Flame className="h-5 w-5 text-primary mr-2" />
                  <span>Unlimited group classes</span>
                </li>
                <li className="flex items-center">
                  <Flame className="h-5 w-5 text-primary mr-2" />
                  <span>4 free personal training sessions</span>
                </li>
                <li className="flex items-center">
                  <Flame className="h-5 w-5 text-primary mr-2" />
                  <span>Premium locker access</span>
                </li>
                <li className="flex items-center">
                  <Flame className="h-5 w-5 text-primary mr-2" />
                  <span>Free towel service</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/register?plan=annual">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
