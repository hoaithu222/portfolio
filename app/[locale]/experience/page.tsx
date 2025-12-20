import React from 'react'
import ExperiencePage from '@/page/experience'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  return {
    title: locale === 'vi' ? 'Kinh nghiệm' : 'Experience',
    description: locale === 'vi'
      ? 'Kinh nghiệm làm việc và dự án của Vũ Thị Hoài Thu - Lập trình viên Front-end'
      : 'Work experience and projects of Vu Thi Hoai Thu - Front-end Developer',
    keywords: locale === 'vi'
      ? ['Kinh nghiệm', 'Dự án', 'Portfolio', 'Front-end Developer', 'React', 'Next.js']
      : ['Experience', 'Projects', 'Portfolio', 'Front-end Developer', 'React', 'Next.js'],
  }
}

const Experience = () => {
  return (
    <ExperiencePage />
  )
}

export default React.memo(Experience)
