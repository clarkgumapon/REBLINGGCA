"use client"

import Image from "next/image"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f"
          alt="Gym interior"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About Us</h1>
          <p className="text-xl md:text-2xl">Building a stronger, healthier community since 2015</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
                alt="Our gym equipment"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-6">
                Founded in 2015, Niel&apos;s Fitness Gym started as a small local gym with a big dream: 
                to create a fitness facility that would be more than just a place to work out. We 
                envisioned a community hub where people from all walks of life could come together, 
                support each other, and achieve their fitness goals.
              </p>
              <p className="text-muted-foreground mb-6">
                Over the years, we&apos;ve grown into one of Manila&apos;s premier fitness facilities, 
                but our core mission remains the same: to provide a welcoming, inclusive environment 
                where everyone can thrive on their fitness journey.
              </p>
              <p className="text-muted-foreground">
                Today, we&apos;re proud to serve our community with state-of-the-art equipment, 
                expert trainers, and a wide range of programs designed to help our members achieve 
                their personal best.
              </p>
            </div>
          </div>

          {/* Facilities Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-6">Our Facilities</h2>
              <p className="text-muted-foreground mb-6">
                Our gym is equipped with the latest fitness technology and equipment to ensure you 
                get the most out of your workouts. From cardio machines to free weights, we have 
                everything you need to reach your fitness goals.
              </p>
              <ul className="space-y-4 text-muted-foreground">
                <li>• State-of-the-art cardio equipment</li>
                <li>• Comprehensive free weights area</li>
                <li>• Dedicated functional training zone</li>
                <li>• Spacious group fitness studios</li>
                <li>• Modern locker rooms and shower facilities</li>
                <li>• Comfortable recovery area</li>
              </ul>
            </div>
            <div className="relative h-[500px] order-1 md:order-2">
              <Image
                src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77"
                alt="Our facilities"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Values Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1574680096145-d05b474e2155"
                  alt="Community"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-2">Community</h3>
                <p className="text-muted-foreground">
                  We believe in building a supportive community where members encourage and inspire each other.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f"
                  alt="Excellence"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-2">Excellence</h3>
                <p className="text-muted-foreground">
                  We strive for excellence in everything we do, from our facilities to our service.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2"
                  alt="Innovation"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously evolve and adapt to bring you the latest in fitness technology and methods.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
