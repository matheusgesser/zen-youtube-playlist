import { Header } from "@/components/Header";
import PlaylistInput from "@/components/PlaylistInput";

export default async function Home() {
    return (
        <div className="min-h-screen p-4 pb-20 gap-16 sm:py-10 sm:px-20">
            <main className="flex flex-col gap-8">
                <Header />

                <div className="min-h-64 grid place-items-center">
                    <PlaylistInput />
                </div>
            </main>
        </div>
    );
}
