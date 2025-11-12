"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function FloatingPetals() {
    const [petals, setPetals] = useState([])

    useEffect(() => {
        const petalList = Array.from({ length: 3 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 2,
        }))
        setPetals(petalList)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {petals.map((petal) => (
                <motion.div
                    key={petal.id}
                    className="absolute text-3xl"
                    initial={{
                        x: `${petal.left}%`,
                        y: -50,
                        opacity: 1,
                        rotate: 0,
                    }}
                    animate={{
                        y: "100vh",
                        x: `${petal.left + 30}%`,
                        opacity: 0,
                        rotate: 360,
                    }}
                    transition={{
                        duration: 8 + Math.random() * 4,
                        delay: petal.delay,
                        ease: "linear",
                        repeat: Number.POSITIVE_INFINITY,
                    }}
                >
                    {["🌸", "🌷", "🌹"][Math.floor(Math.random() * 3)]}
                </motion.div>
            ))}
        </div>
    )
}
