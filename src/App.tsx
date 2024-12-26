//@ts-nocheck
import React, { useEffect, useState } from "react";

const MemoryModal = ({ isOpen, onClose, title, image, description }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">
          X
        </button>
        <div className="modal-grid">
          <div className="modal-image">
            <img src={require(`./assets/${image}.png`)} alt={title} />
          </div>
          <div className="modal-text">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    const createStars = () => {
      const starsContainer = document.querySelector(".stars");
      const starCount = 200;

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.className = "constellation";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animation = `floatStars ${3 + Math.random() * 4}s infinite`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starsContainer.appendChild(star);
      }
    };

    const createFallingStar = () => {
      const star = document.createElement("div");
      star.className = "falling-star";
      star.style.left = `${Math.random() * 100 + 20}%`;
      star.style.top = "-10px";

      const animation = star.animate(
        [
          { transform: "translate(0, 0) rotate(-45deg)", opacity: 1 },
          {
            transform: `translate(-${200 + Math.random() * 300}px, ${
              200 + Math.random() * 300
            }px) rotate(-45deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 2000 + Math.random() * 1000,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }
      );

      document.querySelector(".falling-stars-container").appendChild(star);
      animation.onfinish = () => star.remove();
    };

    const addParallax = () => {
      document.addEventListener("mousemove", (e) => {
        const messageBox = document.querySelector(".message-box");
        if (!messageBox) return;

        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const moveX = (clientX - centerX) / 50;
        const moveY = (clientY - centerY) / 50;

        messageBox.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
      });
    };

    createStars();
    addParallax();

    setTimeout(() => {
      const message = document.querySelector(".message");
      if (message) message.classList.add("visible");
    }, 500);

    const starInterval = setInterval(createFallingStar, 3000);

    return () => {
      clearInterval(starInterval);
      document.removeEventListener("mousemove", addParallax);
    };
  }, []);

  const memories = {
    "Our First Date": {
      description:
        "That magical evening when we first met. 🌟 The nervousness, the excitement, and the beginning of our beautiful journey together. 💕 And the first day in Sarita—we never imagined we would become a regular couple who goes to Sarita every weekend. 🥰 Our First Kiss 💋, First Hug 🤗, and the excitement after our first kiss—that feeling we will never forget. ✨",
      image: "first",
    },
    "Favorite Memory": {
      description:
        "When we both bought the black cloth 🖤 and wore it on the same day to Sarita. We were so excited to kiss each other 😘, ignoring the guard who kept whistling 😅, and kept loving each other ❤️. How happy we looked clicking selfies together 📸!",
      image: "second",
    },
    "Special Moment": {
      description:
        "It is very special for me because that day I dropped you at Ranip and we played Garba 💃🕺. It was my first time playing Garba, and we clicked pictures together in front of everyone for the first time 🥳. We left early from Garba and shared romantic moments while riding the Activa 🛵. Those goosebumps when your cheek touched mine—I can't forget that moment 🥺💕. Even thinking about it gives me goosebumps! 🥰",
      image: "third",
    },
    "Together Forever": {
      description:
        "Our first trip together ✈️, our first time on a flight 🛫, and our first bedroom romance 💏. Those late-night shopping sprees 🛍️ and bargaining with shopkeepers 🛒. Our first boba coffee 🧋. On the beach, we had so much fun 🏖️—our feet touched the waves 🌊, and we took so many pictures together 📷. We will always be together ❤️ and will explore the world hand in hand 🌎.",
      image: "fourth",
    },
  };

  const handleCardClick = (title) => {
    setModalData({
      isOpen: true,
      title,
      description: memories[title].description,
      image: memories[title].image,
    });
  };

  return (
    <div className="app">
      <div className="gradient-bg"></div>
      <div className="moon"></div>
      <div className="stars"></div>
      <div className="falling-stars-container"></div>

      <div className="message-container">
        <h1 className="title">Happy Birthday, My Love</h1>

        <div className="message-box">
          <div className="message">
            To the one who makes my world brighter,
            <br />
            <br />
            Every moment with you is a celebration of love, laughter, and dreams
            coming true. You're not just my partner, you're my inspiration, my
            comfort, and my joy.
            <br />
            <br />
            Today, we celebrate you - the most amazing person I've ever known.
            Your smile lights up my darkest days, your love gives me strength,
            and your presence makes my life complete.
            <br />
            <br />
            Here's to you, my love. Happy Birthday! ✨
          </div>
        </div>

        <div className="memory-wall">
          {Object.keys(memories).map((title) => (
            <div
              key={title}
              className="memory-card"
              onClick={() => handleCardClick(title)}
            >
              {title}
            </div>
          ))}
        </div>
      </div>

      <MemoryModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        title={modalData.title}
        image={modalData.image}
        description={modalData.description}
      />
    </div>
  );
};

export default App;
