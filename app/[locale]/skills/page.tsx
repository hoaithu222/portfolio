import React from 'react'
import SkillsPage from '@/page/skills'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  return {
    title: locale === 'vi' ? 'Kỹ năng' : 'Skills',
    description: locale === 'vi'
      ? 'Kỹ năng và công nghệ của Vũ Thị Hoài Thu: React, Next.js, TypeScript, JavaScript, và nhiều công nghệ Front-end khác'
      : 'Skills and technologies of Vu Thi Hoai Thu: React, Next.js, TypeScript, JavaScript, and other Front-end technologies',
    keywords: locale === 'vi'
      ? ['Kỹ năng', 'React', 'Next.js', 'TypeScript', 'JavaScript', 'Front-end', 'Web Development']
      : ['Skills', 'React', 'Next.js', 'TypeScript', 'JavaScript', 'Front-end', 'Web Development'],
  }
}

const Skills = () => {
  return (
    <SkillsPage />
  )
}

export default React.memo(Skills)