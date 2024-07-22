import React from 'react';
import SEO from '@/global/components/seo';
import HeaderTwo from '@/global/layout/headers/header';
import Footer from '@/global/layout/footers/footer';
import Wrapper from '@/global/layout/wrapper';
import CompareArea from '@/global/components/compare/compare-area';
import CommonBreadcrumb from '@/global/components/breadcrumb/common-breadcrumb';

const ComparePage = () => {
    return (
        <Wrapper>
            <SEO pageTitle="Compare" />
            <HeaderTwo style_2={true} />
            <CommonBreadcrumb title="Comparison" subtitle="My Compare" />
            <CompareArea />
            <Footer primary_style={true} />
        </Wrapper>
    );
};

export default ComparePage;
