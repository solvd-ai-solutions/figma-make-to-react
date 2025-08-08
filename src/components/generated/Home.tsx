import React from 'react'
import { Picture } from '@/components/ui/Picture'
import Svg1 from '../../../figma-exports/assets/logo.svg'
export interface HomeProps {
  title?: string;
  text1?: string;
  text2?: string;
  image1Src?: string;
  image1Alt?: string;
  image2Src?: string;
  image2Alt?: string;
  content?: React.ReactNode
}
export default function Home(props: HomeProps) {
  return (
    <>
      <html><head></head><body><div data-as="main" className="flex flex-col gap-4 p-4">
        <div data-as="header" className="header flex items-center justify-center gap-2">
          <Svg1 className="w-10 h-10" />
          <h1 className="text-primary text-lg font-bold">${'}props.${key} ?? `${safe}`${'}</h1>
        </div>
      
        <div className="hero flex flex-col gap-4 grid grid-cols-2 gap-4">
          <div className="copy">
            <p>${'}props.${s.name} ?? (<>${defaultJsx}</>)${'}</p>
            <a href="#" className="rounded px-4 py-2 bg-accent text-background font-semibold">${'}props.${key} ?? `${safe}`${'}</a>
          </div>
          <div className="media items-center justify-center">
            <Picture src={props.image2Src ?? "/images/hero.svg"} alt={props.image2Alt ?? "Hero Illustration"} className="w-full h-auto" />
          </div>
        </div>
      </div>
      
      </body></html>
    </>
  )
}
