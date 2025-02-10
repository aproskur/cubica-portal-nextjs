'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Aside from "@/components/Aside";
import GameGallery from "@/components/GameGallery";
import { useState } from "react";


export default function Home() {

  const games = [
    {
      id: 1,
      title: "Пингвины",
      slug: "pinguins",
      image: "/assets/images/antarctika.webp",
      rating: 5,
      reviews: 244,
      pricePerLaunch: 750,
      pricePerMonth: 1650,
      description: "An exciting adventure in Antarctica."
    },
    {
      id: 2,
      title: "Приключения Тома Сойера и его закадычного друга",
      slug: "adventures-of-tom-sawyer",
      image: "/assets/images/tom.webp",
      reviews: 320,
      rating: 4,
      pricePerLaunch: 650,
      pricePerMonth: 1550,
      description: "Explore the classic adventures of Tom Sawyer and his friends."
    },
    {
      id: 3,
      title: "Пингвины",
      slug: "pinguins",
      image: "/assets/images/antarctika.webp",
      rating: 5,
      reviews: 244,
      pricePerLaunch: 750,
      pricePerMonth: 1650,
      description: "An exciting adventure in Antarctica."
    },
    {
      id: 4,
      title: "Приключения Тома Сойера и его закадычного друга Приключения Тома Сойера и его закадычного друга Приключения Тома Сойера и его закадычного друга",
      slug: "adventures-of-tom-sawyer",
      image: "/assets/images/tom.webp",
      reviews: 320,
      rating: 4,
      pricePerLaunch: 650,
      pricePerMonth: 1550,
      description: "Explore the classic adventures of Tom Sawyer and his friends."
    }
  ];

  const [searchQuery, setSearchQuery] = useState("");

  return (

    <main className="main">
      <Header />
      <div className="flexWrapper">
        <Aside type="main" setSearchQuery={setSearchQuery} />
        <GameGallery games={games} searchQuery={searchQuery} />
      </div>
    </main>

  );
}
