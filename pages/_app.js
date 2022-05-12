import '../styles/globals.css'
import Link from 'next/link'


function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-purple-900 h-screen">
      <nav className="p-6 bg-purple-500 border-b-4 border-light-blue-500">
        <p className="text-4xl font-bold text-white">
            QuestForOasis Marketplace
        </p>
        <div className="flex mt-4 border-white-500">
            <Link href="/">
                <a className="mr-6 text-white-500 text-white">
                    Sale
                </a>
            </Link>

            <Link href="/create-item">
                <a className="mr-6 text-white-500 text-white">
                    Mint Warrior
                </a>
            </Link>

            <Link href="/my-assets">
                <a className="mr-6 text-white-500 text-white">
                    My Warrior
                </a>
            </Link>

            <Link href="/creator-dashboard">
                <a className="mr-6 text-white-500 text-white">
                    Warrior Dashboard
                </a>
            </Link>
        </div>
      </nav>
      <Component {...pageProps}/>
    </div>
  )
}

export default MyApp
