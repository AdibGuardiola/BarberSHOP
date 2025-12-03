"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./IntroPage.module.css";

const IntroPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ctx: any;

    const initGsap = async () => {
      if (typeof window === "undefined") return;

      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Parallax suave para las imágenes
        gsap.utils.toArray<HTMLImageElement>("[data-speed]").forEach((img) => {
          const speed = Number(img.dataset.speed || 0.5);

          gsap.to(img, {
            y: () => ScrollTrigger.maxScroll(window) * speed * -0.15,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        // Entrada de los títulos
        gsap.from(`.${styles.introTitleLine}`, {
          yPercent: 100,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
        });

        // Fase 2
        gsap.from(`.${styles.phaseTwoCard}`, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.phaseTwo}`,
            start: "top 75%",
          },
        });

        // Fase 3
        gsap.from(`.${styles.phaseThreeImage}`, {
          scale: 0.9,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.phaseThree}`,
            start: "top 75%",
          },
        });
      }, containerRef);
    };

    initGsap();

    return () => {
      ctx?.revert?.();
    };
  }, []);

  const photos = [
    { src: "/images/1.1.jpg", alt: "Foto 1" },
    { src: "/images/1.2.jpg", alt: "Foto 2" },
    { src: "/images/1.3.jpg", alt: "Foto 3" },
    { src: "/images/1.4.jpg", alt: "Foto 4" },
    { src: "/images/1.5.jpg", alt: "Foto 5" },
  ];

  return (
    <div ref={containerRef} className={styles.introPage}>
      {/* FASE 1 */}
      <section className={`${styles.phase} ${styles.phaseOne}`} id="phase-one">
        <div className={styles.phaseOneTitle}>
          <h1 className={styles.introTitle}>
            <span className={styles.introTitleLine}>Barber</span>
            <span className={styles.introTitleLine}>Shop G201</span>
          </h1>
          <p className={styles.introSubtitle}>
            Página de introducción con scroll suave y una galería de fotos para
            presentar tu peluquería de barrio.
          </p>
          <div className={styles.introIndicator}>Desplaza para ver más ↓</div>
        </div>

        <div className={styles.photoGrid}>
          {photos.map((photo, i) => (
            <figure
              key={photo.src}
              className={`${styles.photoItem} ${
                styles[`photoItem${i + 1}`]
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                data-speed={0.7 + i * 0.1}
              />
            </figure>
          ))}
        </div>
      </section>

      {/* FASE 2 */}
      <section className={`${styles.phase} ${styles.phaseTwo}`} id="phase-two">
        <div className={styles.phaseTwoCard}>
          <h2>Nuestra esencia junto al mar</h2>

          <p>
            A unos pasos de la playa de <strong>Las Canteras</strong>, nuestra
            BarberShop combina técnica profesional con la frescura del ambiente
            costero. Cada servicio está pensado para realzar tu estilo
            manteniendo la naturalidad, la comodidad y la esencia de la isla.
          </p>

          <p>
            Ofrecemos <strong>cortes de tendencia</strong>, coloración precisa,
            tratamientos de brillo y alisados de alta calidad, siempre con
            productos premium y un equipo especializado. Todo ello acompañado de
            un entorno moderno, relajado y con reservas online rápidas
            conectadas a Firebase.
          </p>

          <p>
            Esta sección da paso al corazón del proyecto: una experiencia
            cuidada, visual y fluida gracias a <strong>GSAP</strong>, donde
            cada imagen y cada movimiento te acompaña como una brisa suave de
            mar.
          </p>
        </div>
      </section>

      {/* FASE 3 */}
      <section
        className={`${styles.phase} ${styles.phaseThree}`}
        id="phase-three"
      >
        <div className={styles.phaseThreeInner}>
          <div className={styles.phaseThreeText}>
            <h2>Buahhh CHAVAL!!!!</h2>
            <p>
              Desde aquí puedes ir a la página de servicios, elegir un corte y
              reservar tu cita con tu cuenta.
            </p>
            <Link href="/" className={styles.ctaButton}>
              Ir a servicios
            </Link>
          </div>
          <div className={styles.phaseThreeImages}>
            {photos.slice(0, 3).map((photo) => (
              <div className={styles.phaseThreeImage} key={photo.src}>
                <img src={photo.src} alt={photo.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntroPage;
