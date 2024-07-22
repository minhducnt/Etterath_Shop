import BannerArea from '@/global/components/banner/banner-area';
import HomeHeroSlider from '@/global/components/hero-banner/home-hero-slider';
import NewArrivals from '@/global/components/products/new-arrivals';
import OfferProducts from '@/global/components/products/offer-products';
import ProductArea from '@/global/components/products/product-area';
import ProductBanner from '@/global/components/products/product-banner';
import SEO from '@/global/components/seo';
import Header from '@/global/layout/headers/header';
import Footer from '@/global/layout/footers/footer';
import Wrapper from '@/global/layout/wrapper';

function Home() {
    return (
        <Wrapper>
            <SEO pageTitle="Home" />
            <Header style_2={true} />
            <HomeHeroSlider />
            <ProductArea />
            <BannerArea />
            <OfferProducts />
            <ProductBanner />
            <NewArrivals />
            <Footer primary_style={true} />
        </Wrapper>
    );
}

export default Home;
