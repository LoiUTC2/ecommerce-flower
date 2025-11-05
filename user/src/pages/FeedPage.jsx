import React from "react";
import { Card, CardHeader, CardContent } from "../components/ui/card";

export default function FeedPage() {
    const posts = [
        { id: 1, author: "Linh Shop", content: "🌸 Hoa baby tươi mới về nhé!", image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6" },
        { id: 2, author: "Hoa Mai Garden", content: "Ưu đãi 50% cho combo 3 bó!", image: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65" },
    ];

    return (
        <div className="grid gap-4">
            {posts.map((p) => (
                <Card key={p.id}>
                    <CardHeader>
                        <h3 className="font-semibold">{p.author}</h3>
                    </CardHeader>
                    <CardContent>
                        <p>{p.content}</p>
                        <img src={p.image} alt="" className="rounded-md mt-3 w-full object-cover max-h-60" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
