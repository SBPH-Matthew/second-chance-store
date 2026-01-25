export default function Hero() {
    return (
        <section className="bg-bg-light-blue py-10">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] items-stretch min-h-[520px] rounded-lg  overflow-hidden bg-bg-light-blue">
                    <div className="p-16 flex flex-col justify-center">
                        <h1 className="text-[4.5rem] leading-[1.05] mb-8 font-poppins font-bold text-black">
                            Give your<br />items a<br />second life
                        </h1>
                        <p className="text-lg text-gray-700 mb-12 max-w-[440px] leading-relaxed">
                            Buy and sell pre-owned items and vehicles with ease. Connect with your community and find exactly what you need.
                        </p>
                        <div className="flex gap-4">
                            <button className="btn-primary !px-10 !py-3.5 text-base">Browse</button>
                            <button className="px-10 py-3.5 text-base rounded-md border border-blue-100 bg-blue-50/50 text-gray-700 font-semibold hover:bg-blue-100 transition-colors">
                                Sell
                            </button>
                        </div>
                    </div>
                    <div
                        className="bg-cover bg-center min-h-full"
                        style={{ backgroundImage: 'url("/hero_cafe.png")' }}
                    >
                    </div>
                </div>
            </div>
        </section>
    );
}
