import { Avatar, Typography, Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { FaMedal } from "react-icons/fa";
import { format } from "date-fns";

const AnniversarySection = ({ anniversaries }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!anniversaries || anniversaries.length === 0) {
            return; // Skip animation if there are no anniversaries
        }

        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Canvas element not found!");
            return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
            console.error("Unable to get canvas context!");
            return;
        }

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const confetti = initializeConfetti(canvas, context);
        let animationFrame;
        let fadeOutStartTime = null;

        const step = (timestamp) => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Apply blur effect to the entire canvas
            context.filter = 'blur(2px)'; // Apply blur with 2px radius

            confetti.forEach((particle) => particle.draw());

            if (fadeOutStartTime) {
                const elapsed = timestamp - fadeOutStartTime;
                const fadeProgress = Math.min(elapsed / 1000, 1);
                confetti.forEach((particle) => {
                    particle.opacity = Math.max(0, 1 - fadeProgress);
                });
            }

            animationFrame = requestAnimationFrame(step);

            if (fadeOutStartTime && Date.now() - fadeOutStartTime >= 1000) {
                cancelAnimationFrame(animationFrame);
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        animationFrame = requestAnimationFrame(step);

        setTimeout(() => {
            fadeOutStartTime = Date.now();
        }, 1000);

        return () => {
            cancelAnimationFrame(animationFrame);
            context.clearRect(0, 0, canvas.width, canvas.height);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [anniversaries]);

    const initializeConfetti = (canvas, context) => {
        const COLORS = [
            [235, 90, 70],
            [97, 189, 79],
            [242, 214, 0],
            [0, 121, 191],
            [195, 119, 224],
        ];
        const NUM_CONFETTI = 15;
        const range = (a, b) => (b - a) * Math.random() + a;

        return Array.from({ length: NUM_CONFETTI }, () => {
            const style = COLORS[~~range(0, COLORS.length)];
            const rgb = `rgba(${style[0]},${style[1]},${style[2]}`;
            const radius = ~~range(2, 6);
            let x = range(0, canvas.width);
            let y = range(0, canvas.height);
            const vx = range(-2, 2);
            const vy = range(1, 3);
            let opacity = 1;

            return {
                draw: () => {
                    context.beginPath();
                    context.arc(x, y, radius, 0, 2 * Math.PI);
                    context.fillStyle = `${rgb},${opacity})`;
                    context.fill();

                    x += vx;
                    y += vy;

                    if (x > canvas.width || y > canvas.height) {
                        x = range(0, canvas.width);
                        y = -10;
                    }
                },
                opacity,
            };
        });
    };

    return (
        <div
            className="h-[220px] px-2 pb-2 border-[0.5px] border-[#E5E7EB] bg-white rounded-lg shadow-md"
            style={{ position: "relative", overflow: "hidden" }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
                <h1 className="flex text-[20px] font-semibold text-[#67748E] my-2">
                    <FaMedal
                        style={{ color: "gold", fontSize: "24px", margin: "5px 10px" }}
                    />
                    Upcoming Work Anniversaries
                </h1>
                {anniversaries && anniversaries.length > 0 ? (
                    <div
                        className="flex gap-4"
                        style={{
                            display: "flex",
                            overflowX: "auto",
                            whiteSpace: "nowrap",
                            padding: "5px",
                        }}
                    >
                        {anniversaries.map((anniversary, index) => (
                            <Box
                                key={index}
                                className="p-2 border-[0.5px] border-[#E5E7EB] bg-white rounded-lg shadow-md"
                                style={{
                                    minWidth: "155px",
                                    textAlign: "center",
                                    flexShrink: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Avatar
                                    sx={{ height: 60, width: 60, marginBottom: "8px" }}
                                    src={anniversary.user_logo_url || "/placeholder-image.png"}
                                />
                                <Typography
                                    variant="p"
                                    className="font-semibold"
                                    style={{ fontSize: "16px", textAlign: "center" }}
                                >
                                    {anniversary.first_name}{" "}{anniversary.last_name}
                                </Typography>
                                <div
                                    className="bg-[#f766df]"
                                    style={{
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        marginTop: "4px",
                                    }}
                                >
                                    <Typography sx={{ color: "black", textAlign: "center" }}>
                                        {anniversary.joining_date
                                            ? format(new Date(anniversary.joining_date), "d MMM")
                                            : "-"}{" "}
                                        [{anniversary.joining_date
                                            ? `${new Date().getFullYear() - new Date(anniversary.joining_date).getFullYear()} year`
                                            : "-"}]
                                    </Typography>
                                </div>
                            </Box>
                        ))}
                    </div>
                ) : (
                    <Typography
                        variant="body1"
                        style={{ textAlign: "center", padding: "20px" }}
                        className="text-gray-500"
                    >
                        No upcoming work anniversaries.
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default AnniversarySection;
