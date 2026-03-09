"use client";

import { useState, useCallback, useMemo, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FlipCardStack(props) {
    const {
        cards = [],
        cardWidth = 300,
        cardHeight = 400,
        stackOffset = 8,
        stackRotation = -10,
        dragThreshold = 80,
        animationDuration = 0.3,
        animationEase = "easeOut",
        borderRadius = 24,
        shadowIntensity = 0.2,
        style
    } = props;

    const [cardOrder, setCardOrder] = useState(() => cards.map((_, index) => index));

    const getCardTransform = useCallback((index, cardIndex) => {
        const stackPosition = cardOrder.indexOf(cardIndex);
        const positionFromBottom = cardOrder.length - 1 - stackPosition;
        return {
            zIndex: stackPosition,
            y: -positionFromBottom * stackOffset,
            rotate: positionFromBottom * stackRotation,
            scale: 1 - positionFromBottom * 0.02,
            opacity: 1
        };
    }, [cardOrder, stackOffset, stackRotation]);

    const handleDragEnd = useCallback((event, info, cardIndex) => {
        const dragDistance = Math.abs(info.offset.x) + Math.abs(info.offset.y);
        const velocity = Math.abs(info.velocity.x) + Math.abs(info.velocity.y);

        if (dragDistance > dragThreshold || velocity > 800) {
            startTransition(() => {
                setCardOrder(prevOrder => {
                    const newOrder = [...prevOrder];
                    const draggedCardPosition = newOrder.indexOf(cardIndex);
                    const draggedCard = newOrder.splice(draggedCardPosition, 1)[0];
                    newOrder.unshift(draggedCard);
                    return newOrder;
                });
            });
        }
    }, [dragThreshold]);

    const cardVariants = {
        initial: custom => ({
            ...custom,
            x: 0,
            y: custom.y
        }),
        animate: custom => ({
            ...custom,
            x: 0,
            y: custom.y,
            transition: {
                type: "spring",
                damping: 30,
                stiffness: 500,
                mass: 0.5,
                restDelta: 0.01,
                restSpeed: 0.01
            }
        }),
        drag: {
            scale: 1.05,
            rotate: 0,
            transition: {
                duration: 0.05
            }
        }
    };

    const renderedCards = useMemo(() => {
        return cards.map((card, index) => {
            const transform = getCardTransform(index, index);
            const isTopCard = cardOrder.indexOf(index) === cardOrder.length - 1;

            return (
                <motion.div
                    key={`card-${index}`}
                    custom={transform}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileDrag="drag"
                    drag={isTopCard}
                    dragConstraints={{
                        top: -150,
                        bottom: 150,
                        left: -150,
                        right: 150
                    }}
                    dragElastic={0.2}
                    dragSnapToOrigin={true}
                    dragTransition={{
                        power: 0.3,
                        timeConstant: 125,
                        bounceStiffness: 500,
                        bounceDamping: 30
                    }}
                    onDragEnd={(event, info) => handleDragEnd(event, info, index)}
                    style={{
                        position: "absolute",
                        width: cardWidth,
                        height: cardHeight,
                        borderRadius,
                        overflow: "hidden",
                        cursor: isTopCard ? "grab" : "default",
                        boxShadow: `0px ${4 + transform.zIndex * 2}px ${8 + transform.zIndex * 4}px rgba(0, 0, 0, ${shadowIntensity})`,
                        ...transform // Apply transform directly to style to ensure initial state is correct, or rely on motion
                    }}
                    whileHover={isTopCard ? {
                        scale: 1.02
                    } : {}}
                >
                    {card.image && (
                        <img
                            src={card.image.src}
                            srcSet={card.image.srcSet}
                            alt={card.image.alt || `Card ${index + 1}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: `${card.image.positionX || "50%"} ${card.image.positionY || "50%"}`,
                                userSelect: "none",
                                pointerEvents: "none"
                            }}
                        />
                    )}
                    {(card.title || card.description) && (
                        <div style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                            color: "white",
                            padding: "24px",
                            textAlign: "left"
                        }}>
                            {card.title && <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "600" }}>{card.title}</h3>}
                            {card.description && <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>{card.description}</p>}
                        </div>
                    )}
                </motion.div>
            );
        });
    }, [cards, cardOrder, cardWidth, cardHeight, borderRadius, shadowIntensity, getCardTransform, cardVariants, handleDragEnd]);

    return (
        <div style={{
            ...style,
            position: "relative",
            width: cardWidth,
            height: cardHeight,
            perspective: "1000px"
        }}>
            <AnimatePresence>
                {renderedCards}
            </AnimatePresence>
            {cards.length === 0 && (
                <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f0f0f0",
                    borderRadius,
                    border: "2px dashed #ccc",
                    color: "#666",
                    textAlign: "center",
                    fontSize: "14px"
                }}>
                    Add cards to create<br />your flip stack
                </div>
            )}
        </div>
    );
}
