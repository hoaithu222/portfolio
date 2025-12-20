import HomePage from "@/page/home"
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  return {
    title: locale === 'vi' ? 'Trang chủ' : 'Home',
    description: locale === 'vi'
      ? 'Trang chủ portfolio của Vũ Thị Hoài Thu - Lập trình viên Front-end chuyên nghiệp'
      : 'Homepage of Vu Thi Hoai Thu - Professional Front-end Developer Portfolio',
  }
}

const Home = () => {
  return (
    <HomePage />
  )
}

export default Home