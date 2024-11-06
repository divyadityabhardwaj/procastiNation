'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CheckCircle, Play, FileText, ListTodo, Mountain } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import "./globals.css"
import Modal from '@/components/Modal'

export default function LandingPageJs() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Mountain className="h-6 w-6 mr-2" />
          <span className="text-lg font-bold">ProcrastiNation</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">Features</Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">Pricing</Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#faq">FAQ</Link>
        </nav>
        <div className="ml-4 flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(true)}>Log In</Button>
          <Button size="sm" onClick={() => setIsModalOpen(true)}>Sign Up</Button>
        </div>
      </header>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        onLoginSuccess={() => setIsModalOpen(false)}
      />
      <Link href="/sessions">
        <Button size="sm">Go to Sessions</Button>
      </Link>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Your Ultimate Study Workspace for Videos, Notes, and AI-Powered Insights
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Seamlessly integrate videos, organize your notes, and let AI help you summarize, learn, and stay productive&mdash;all in one place.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started for Free</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32" id="features">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Organize, Study, and Stay on Track</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ProcrastiNation is your all-in-one study companion designed to help you learn more efficiently. Whether you&apos;re watching videos, taking notes, or summarizing key points, ProcrastiNation makes studying easier and more interactive.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Workspaces for Every Subject</h3>
                      <p className="text-muted-foreground">
                        Organize your studies with flexible, customizable pages.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">AI-Powered Summaries</h3>
                      <p className="text-muted-foreground">Summarize YouTube videos or transcripts with a click.</p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Time-Stamped Notes</h3>
                      <p className="text-muted-foreground">
                        Take notes while watching videos, with automatic timestamping for easy reference.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Task Management</h3>
                      <p className="text-muted-foreground">Keep track of assignments, to-dos, and study goals.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center">
              <Button size="lg">Start Your Free Study Session</Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Why Choose ProcrastiNation?</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Play className="w-6 h-6 mb-2" />
                    Seamless Video Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Embed YouTube videos directly into your workspace and take notes while watching. With time-stamped notes&comma; you can easily revisit key points with just one click&period;
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <FileText className="w-6 h-6 mb-2" />
                    AI Summaries & Q&A
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Tired of long videos? Use AI to generate concise summaries of any video or transcript. Have questions? Our
                  AI-powered Q&A feature delivers fast, accurate answers based on your video content.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Customizable Study Pages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Create your own study space with flexible, drag-and-drop blocks. Add text, videos, tasks, or even images
                  to keep everything organized and tailored to how you study best.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <ListTodo className="w-6 h-6 mb-2" />
                    Stay Organized with Tasks and Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  Turn your notes into action items. With built-in task management, track your assignments, set deadlines,
                  and prioritize what&apos;s important.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How ProcrastiNation Helps You Study Smarter
            </h2>
            <div className="grid gap-6 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary p-3">
                  <CheckCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Create Your Workspace</h3>
                <p className="text-muted-foreground">
                  Start by creating a workspace for each subject or project you&apos;re working on. Customize it with notes,
                  videos, tasks, and more.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary p-3">
                  <Play className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Add Videos and Take Notes</h3>
                <p className="text-muted-foreground">
                  Embed YouTube videos into your workspace. While watching, take time-stamped notes, making it easy to refer
                  back to important moments in the video.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary p-3">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Use AI to Summarize and Learn</h3>
                <p className="text-muted-foreground">
                  Let AI generate summaries for your videos or text. Ask questions and receive AI-powered answers directly
                  in your workspace.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary p-3">
                  <ListTodo className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Track Progress and Stay Productive</h3>
                <p className="text-muted-foreground">
                  Use the built-in task manager to keep track of your study goals, deadlines, and assignments.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <Button size="lg">Try It Now – Free!</Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Users Are Saying</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <blockquote className="text-lg">
                    &quot;ProcrastiNation completely transformed the way I study. The AI summaries save me so much time, and the
                    video notes feature is a game changer!&quot;
                  </blockquote>
                  <footer className="mt-4">
                    <p className="font-semibold">Sarah</p>
                    <p className="text-sm text-muted-foreground">University Student</p>
                  </footer>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <blockquote className="text-lg">
                    &quot;It&apos;s like Notion but specifically for studying! The way I can link my YouTube videos with notes and
                    tasks in one place is incredible.&quot;
                  </blockquote>
                  <footer className="mt-4">
                    <p className="font-semibold">James</p>
                    <p className="text-sm text-muted-foreground">Graduate Student</p>
                  </footer>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32" id="pricing">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Unlock Your Full Study Potential
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Free Tier</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Create up to 5 workspaces</li>
                    <li>Video integration and note-taking</li>
                    <li>Basic AI tools for summarization</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-8">
                  <Button className="w-full">Get Started for Free</Button>
                </div>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pro Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Unlimited workspaces</li>
                    <li>Advanced AI tools (Q&A, extended summaries)</li>
                    <li>Priority support</li>
                    <li>Custom templates and page layouts</li>
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full">Unlock Pro Features</Button>
                </div>
              </Card>
            </div>
          </div>
        
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted" id="faq">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is ProcrastiNation?</AccordionTrigger>
                <AccordionContent>
                  ProcrastiNation is a study platform where you can organize your study materials, integrate YouTube videos,
                  take notes, and use AI-powered tools to summarize content and answer questions.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How does the AI summarization work?</AccordionTrigger>
                <AccordionContent>
                  Our AI tools analyze the transcript of any video or text input and generate concise, easy-to-understand
                  summaries. Perfect for saving time on long videos!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is ProcrastiNation free?</AccordionTrigger>
                <AccordionContent>
                  Yes! You can create up to 5 workspaces with video notes and basic AI tools for free. You can unlock
                  additional features with a one-time payment for the Pro Plan.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Study Smarter?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Join ProcrastiNation today and transform your study experience with AI-powered tools and seamless video
                  integration.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg">Sign Up Free Today</Button>
                <Button size="lg" variant="outline">
                  Explore Our Features
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 ProcrastiNation. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}