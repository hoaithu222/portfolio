import React from 'react'
import ContactPage from '@/page/contact'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  return {
    title: locale === 'vi' ? 'Liên hệ' : 'Contact',
    description: locale === 'vi'
      ? 'Liên hệ với Vũ Thị Hoài Thu - Lập trình viên Front-end. Email: thu601925@gmail.com, Phone: 0382329310'
      : 'Contact Vu Thi Hoai Thu - Front-end Developer. Email: thu601925@gmail.com, Phone: +84382329310',
  }
}

const Contact = () => {
  return (
    <ContactPage />
  )
}

export default React.memo(Contact)
