import { useDispatch } from 'react-redux';
import InputRange from '@/global/utils/ui/input-range';
import { handleFilterSidebarClose } from '@/redux/features/shop-filter-slice';
import { Helper } from '@/global/utils/helpers/misc';

const PriceFilter = ({ priceFilterValues, maxPrice }) => {
    const dispatch = useDispatch();
    const { priceValue, handleChanges } = priceFilterValues;

    return (
        <>
            <div className="tp-shop-widget mb-35">
                <h3 className="tp-shop-widget-title no-border">Price Filter</h3>

                <div className="tp-shop-widget-content">
                    <div className="tp-shop-widget-filter">
                        <div id="slider-range" className="mb-10">
                            <InputRange STEP={1} MIN={0} MAX={maxPrice} values={priceValue} handleChanges={handleChanges} />
                        </div>

                        <div className="tp-shop-widget-filter-info d-flex align-items-center justify-content-between">
                            <span className="input-range">
                                {Helper.formatCurrency(priceValue[0])} - {Helper.formatCurrency(priceValue[1])}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PriceFilter;
