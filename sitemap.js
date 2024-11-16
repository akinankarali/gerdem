import { fetchBlogs, fetchPaintings, fetchTravelRoutes } from './services/firebaseService'

export default async function sitemap() {

    const [blogs, paintings, travelRoutes] = await Promise.all([
        fetchBlogs(),
        fetchPaintings(),
        fetchTravelRoutes()
      ])
    
      const blogEntries = blogs[0]?.items.map((post) => ({
        url: `https://www.gerdem.net/blog/${post.id}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly',
        priority: 0.7,
      })) || []
    
      const paintingEntries = paintings.map((painting) => ({
        url: `https://www.gerdem.net/paintings/${painting.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }))
    
      const travelRouteEntries = travelRoutes[0]?.item.map((route) => ({
        url: `https://www.gerdem.net/travel-routes/${route.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })) || []


      const staticPages = [
        {
          url: 'https://www.gerdem.net',
          lastModified: new Date(),
          changeFrequency: 'yearly',
          priority: 1,
        },
        {
          url: 'https://www.gerdem.net/about',
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        },
        {
          url: 'https://www.gerdem.net/contact',
          lastModified: new Date(),
          changeFrequency: 'yearly',
          priority: 0.5,
        },
        {
          url: 'https://www.gerdem.net/blog',
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.9,
        },
        {
          url: 'https://www.gerdem.net/paintings',
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        },
        {
          url: 'https://www.gerdem.net/travel-routes',
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        },
      ]
      return [...staticPages, ...blogEntries, ...paintingEntries, ...travelRouteEntries]
}