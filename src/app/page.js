import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Aside from "@/components/Aside";
import GameGallery from "@/components/GameGallery";


export default function Home() {

  const games = [
    {
      id: 1,
      title: "Пингвины",
      slug: "pinguins",
      image: "/assets/images/antarctika.webp",
      pricePerLaunch: 750,
      pricePerMonth: 1650,
      description: "An exciting adventure in Antarctica."
    },
    {
      id: 2,
      title: "Приключения Тома Сойера и его закадычного друга",
      slug: "adventures-of-tom-sawyer",
      image: "/assets/images/tom.webp",
      pricePerLaunch: 650,
      pricePerMonth: 1550,
      description: "Explore the classic adventures of Tom Sawyer and his friends."
    },
    {
      id: 3,
      title: "Пингвины",
      slug: "pinguins",
      image: "/assets/images/antarctika.webp",
      pricePerLaunch: 750,
      pricePerMonth: 1650,
      description: "An exciting adventure in Antarctica."
    },
    {
      id: 4,
      title: "Приключения Тома Сойера и его закадычного друга Приключения Тома Сойера и его закадычного друга Приключения Тома Сойера и его закадычного друга",
      slug: "adventures-of-tom-sawyer",
      image: "/assets/images/tom.webp",
      pricePerLaunch: 650,
      pricePerMonth: 1550,
      description: "Explore the classic adventures of Tom Sawyer and his friends."
    }
  ];


  return (

    <main className="main">
      <Header />
      <div className="flexWrapper">
        <Aside type="main" />
        <GameGallery games={games} />
      </div>
    </main>

  );
}
