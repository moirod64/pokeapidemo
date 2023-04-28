import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  interface PokemonList {
    count: number;
    next: string;
    previous?: string;
    results: {
      name: string;
      url: string;
    }[];
  }

  interface Pokemon {
    name: string;
    id: number;
    base_experience: number;
    sprites: {
      front_default: string;
    };
    types: string[];
  }

  const [pkmList, setPkmList] = useState<Pokemon[]>([]);

  const getPokemonList = async (): Promise<PokemonList> => {
    const res = await fetch(
      "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=150",
    );
    return await res.json();
  };

  const getPokemon = async (url: string): Promise<Pokemon> => {
    const dataRes = await fetch(url);
    return await dataRes.json();
  };

  useEffect(() => {
    async function getData() {
      const res = await getPokemonList();
      const pokemonList: Array<Pokemon> = [];
      for (let list of res.results) {
        const resData = await getPokemon(list.url);
        pokemonList.push(resData);
      }
      setPkmList(pokemonList);
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={`${styles.PokemonList}`}>
          {pkmList.map((pkm) => (
            <div key={pkm.id} className={`${styles.main}`}>
              <Image
                alt={pkm.name}
                key={pkm.id}
                src={pkm.sprites.front_default}
                height={80}
                width={80}
              />
              <p>{pkm.name.toUpperCase()}</p>
              <p>Exp: {pkm.base_experience}</p>
              <div>
                {pkm.types.map((el: any) => {
                  if (el.slot === 1) {
                    return <>Type: {el.type.name.toUpperCase()}</>;
                  }
                  return <> & {el.type.name.toUpperCase()}</>;
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
