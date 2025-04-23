import React, { useEffect, useState } from "react"

import { Layout } from "@consta/uikit/Layout"
import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { Text } from "@consta/uikit/Text";
import { TextField } from '@consta/uikit/TextField';
import { Combobox } from '@consta/uikit/Combobox';
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { Loader } from '@consta/uikit/Loader';

import { IconClose } from '@consta/icons/IconClose';

import { TNomenclature } from "../../types/nomenclature-types";
import {  TCheckFilter, TSale } from "../../types/sales-types";
import { deleteCheckSales, getCheckSalesBySerial, getProductBySerial, getSalesFilter } from "../../services/SalesService";
import { getNomenclatures } from "../../services/PurchaseService";
import { DatePicker } from "@consta/uikit/DatePicker";

interface TReturnModalProps {
        isOpen: boolean;
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
        setUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
    }

const ReturnModal = ({isOpen, setIsOpen, setUpdateFlag} : TReturnModalProps) => {

        const closeWindow = () => {
                setSales([]);
                setIsOpen(false);
                setSale(null);
                setIsSearch(false);
                setUpdateFlag(true);
        }
        const [productList, setProductList] = useState<TNomenclature[]>([]);
       
        const [caption, setCaption] = useState<string | null>(null);

        const [serialNumber, setSerialNumber] = useState<string | null>(null);
        const [product, setProduct] = useState<TNomenclature | null>(null);
        const [date, setDate] = useState<Date | null>(null);
        const [customer, setCustomer] = useState<string | null>(null);
        const [sales, setSales] = useState<TSale[]>([]);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [isSearch, setIsSearch] = useState<boolean>(false);

        const [sale, setSale] = useState<TSale | null>(null);



        useEffect(() => {
                const getProducts = async () => {
                                        await  getNomenclatures((resp) => {
                                                setProductList(resp);
                                                setIsLoading(false);
                                            });
                                        }
                getProducts();
                
            }, [isOpen]);

        

const getSalesData = async () => {
        const dateMax: Date | null = date;
        if (dateMax) {
                dateMax.setDate(dateMax.getDate() + 1);
        }
        
                const filterParam : TCheckFilter = {
                        searchText: product?.name ?? null,
                        customer: customer,
                        dateMin: date,
                        dateMax: dateMax,
                        isUnpaid: true,
                        isBooking: true,
                        isPaid: true
                }
                        await getSalesFilter(filterParam).then( (resp) => {
                                if (resp) {
                                        setSales(resp);
                                        setIsLoading(false);
                                }
                        });
                               
        }

const getProduct = async (serialNumber : string | null) => {
                await getProductBySerial(serialNumber, (resp) => {
                        if (resp && resp.isSaled) {
                                setCaption('Товар найден');
                        } else {
                                setCaption('Товар не найден');
                        }
                }).catch(()=>{
                        setCaption('Товар не найден');
                })   
                await getCheckSalesBySerial(serialNumber, (resp) => {
                if (resp) {
                        setSale(resp);
                }})
        }

        


const returnProduct = async (product : TSale) => {
                await deleteCheckSales(product.checkId, [product]).then(() => {
                        closeWindow()
                }
                        ).catch(()=>{
                        setCaption('Товар не найден');
                })             
        }
        
                
        const ruToEnMap: Record<string, string> = {
                а: 'F', б: ',', в: 'D', г: 'U', д: 'L', е: 'T', ё: '`', ж: ';', з: 'P',
                и: 'B', й: 'Q', к: 'R', л: 'K', м: 'V', н: 'Y', о: 'J', п: 'G', р: 'H',
                с: 'C', т: 'N', у: 'E', ф: 'A', х: '[', ц: 'W', ч: 'X', ш: 'I', щ: 'O',
                ы: 'S', э: '\'', ь: 'M', ю: '.', я: 'Z',
                А: 'F', Б: ',', В: 'D', Г: 'U', Д: 'L', Е: 'T', Ё: '`', Ж: ';', З: 'P',
                И: 'B', Й: 'Q', К: 'R', Л: 'K', М: 'V', Н: 'Y', О: 'J', П: 'G', Р: 'H',
                С: 'C', Т: 'N', У: 'E', Ф: 'A', Х: '[', Ц: 'W', Ч: 'X', Ш: 'I', Щ: 'O',
                Ы: 'S', Э: '\'', Ь: 'M', Ю: '.', Я: 'Z',
            };
        
const convertRuToEn = (value : string) => {
        return value.split('').map(char => ruToEnMap[char] || char).join('').toUpperCase();
        };

        
        return (
                <Modal
                        isOpen={isOpen}
                        hasOverlay
                        onEsc={() => {
                                closeWindow();
                        }}
                        style={{width: '75%'}}
                >
                        {!isLoading && (
                        <Layout direction="column" style={{width: '100%'}} className={cnMixSpace({ p:'xl' })}>
                                <Layout direction="row" style={{justifyContent: 'space-between'}}>
                                        <Layout direction="row" >
                                                <Text size="xl" view="brand" style={{width: '100%'}} className={cnMixSpace({ mL:'m', mT: '2xs' })}>
                                                        {'Возврат товара'}
                                                </Text>
                                        </Layout>
                                        
                                        <Button
                                                view="clear"
                                                size="s"
                                                iconLeft={IconClose}
                                                onClick={() => {
                                                        closeWindow();
                                                }}
                                        />
                                </Layout>
                                {!isSearch && (
                                <Layout direction="column" className={cnMixSpace({ mT:'m' })}>
                                        <Text size="s" weight="semibold" align="center">По серийному номеру</Text>
                                        <Layout direction="row" className={cnMixSpace({ mT:'m' })}>
                                                <TextField
                                                        size="s"
                                                        value={serialNumber}
                                                        onChange={(value)=>{
                                                                if (value) {
                                                                        const convertedValue = convertRuToEn(value);
                                                                        const filteredValue = convertedValue.replace(/[^a-zA-Z0-9-]/g, '');
                                                                        setSerialNumber(filteredValue);
                                                                } else {
                                                                        setSerialNumber(null)
                                                                }
                                                        }}
                                                        placeholder="Введите сер. номер"
                                                        caption={caption ?? undefined}
                                                        status={caption === 'Товар не найден' ? 'alert' : caption === 'Товар найден' ? 'success' : undefined}
                                                        onFocus={()=>{
                                                                setCaption(null);
                                                        }}
                                                />
                                                <Button 
                                                        label={'Проверить'}
                                                        view="secondary"
                                                        className={cnMixSpace({mL:'s'})}
                                                        size="s"
                                                        onClick={()=>{
                                                                getProduct(serialNumber);
                                                        }}
                                                />
                                                <Button 
                                                        label={'Оформить возврат'}
                                                        view="primary"
                                                        size="s"
                                                        className={cnMixSpace({ mL:'m' })}
                                                        onClick={()=>{
                                                                if (sale) {
                                                                        returnProduct(sale);
                                                                }
                                                        }}
                                                />
                                        </Layout>
                                        
                                </Layout>
                                )}
                                {!isSearch && (
                                        <Layout direction="column" className={cnMixSpace({ mT:'l' })}>
                                        <Text size="s" weight="semibold" align="center">По поиску товара</Text>
                                        <Layout direction="row" className={cnMixSpace({ mT:'m' })} style={{alignItems: 'center'}}>
                                                <Text size="s" style={{minWidth: '150px', maxWidth: '150px'}} align="right" className={cnMixSpace({ mR:'xs' })}>Товар:</Text>
                                                <Combobox
                                                        value={product}
                                                        items={productList}
                                                        onChange={(value)=>{
                                                                if (value) {
                                                                        setProduct(value);
                                                                } else {
                                                                        setProduct(null);
                                                                }
                                                        }}
                                                        getItemKey={item => item.itemId ?? 0}
                                                        getItemLabel={item => item.name ?? ''}
                                                        placeholder="Выберите товар"
                                                        size="s"
                                                />
                                        </Layout>
                                        <Layout direction="row" className={cnMixSpace({ mT:'s' })} style={{alignItems: 'center'}}>
                                                <Text size="s" style={{minWidth: '150px', maxWidth: '150px'}} align="right" className={cnMixSpace({ mR:'xs' })}>Дата продажи:</Text>
                                                <DatePicker
                                                        value={date}
                                                        onChange={(value) => {
                                                                if (value) {
                                                                        setDate(value);
                                                                } else {
                                                                        setDate(null);
                                                                }
                                                        }}
                                                        size="s"
                                                />
                                        </Layout>
                                        <Layout direction="row" className={cnMixSpace({ mT:'s' })} style={{alignItems: 'center'}}>
                                                <Text size="s" style={{minWidth: '150px', maxWidth: '150px'}} align="right" className={cnMixSpace({ mR:'xs' })}>Покупатель:</Text>
                                                <TextField
                                                        size="s"
                                                        value={customer}
                                                        onChange={(value) => {
                                                                if (value) {
                                                                        setCustomer(value);
                                                                } else {
                                                                        setCustomer(null);
                                                                }
                                                        }}
                                                        placeholder="Введите покупателя"
                                                />
                                        </Layout>
                                        <Layout direction="row" style={{ justifyContent: 'center'}} className={cnMixSpace({mT:'s'})}>
                                                <Button 
                                                        label={'Поиск'}
                                                        view="secondary"
                                                        size="s"
                                                        onClick={() => {
                                                                setIsLoading(true);
                                                                setIsSearch(true);
                                                                getSalesData();
                                                        }}
                                                />
                                        </Layout>
                                </Layout>
                        )}
                        {isSearch && (
                                <Layout direction="column">
                                        <Text size="s" view="secondary" weight="semibold" className={cnMixSpace({mT:'s'})}>Удалось найти (выберите нужный):</Text>
                                        {isLoading && (
                                               <Layout style={{ minHeight: '150px', alignItems: 'center', justifyContent: 'center'}}>
                                                                                      <Loader size="m" />
                                                                              </Layout>  
                                        )}
                                        {(sales.length > 0) && sales.map((sale) => (
                                                <Layout 
                                                        direction="row" 
                                                        className={cnMixSpace({mT:'s', p: 's'})} 
                                                        style={{border: '1px solid rgba(0,65,102,.2)', borderRadius: '4px', cursor: 'pointer'}}
                                                        onClick={()=>{
                                                                returnProduct(sale);
                                                        }}
                                                >
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{minWidth: '30px', maxWidth: '30px'}}>{sales.indexOf(sale) + 1}</Text>
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{ width: '100%'}}>{sale.name}</Text>
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{minWidth: '150px', maxWidth: '150px'}}>{sale.salePrice}</Text>
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{minWidth: '150px', maxWidth: '150px'}}>{sale.customer}</Text>
                                                        <Text size="xs" className={cnMixSpace({mR:'s'})} style={{minWidth: '100px', maxWidth: '100px'}}>{sale.createdAt?.toString()}</Text>
                                                </Layout>
                                        ))}
                                </Layout>
                        )}
                                <Layout direction="row" style={{justifyContent: 'space-between', alignItems: 'end'}}  flex={1} className={cnMixSpace({ mT:'l' })}>
                                       
                                        <Layout direction="row" style={{justifyContent: 'right'}}>
                                                <Button 
                                                        label={'Закрыть'}
                                                        view="secondary"
                                                        size="s"
                                                        className={cnMixSpace({ mL:'m' })}
                                                        onClick={()=>{
                                                                closeWindow();
                                                        }}
                                                />
                                                
                                        </Layout>
                                </Layout>
                        </Layout>
                        )}
                        {isLoading && (
                                <Layout style={{ minHeight: '450px', alignItems: 'center', justifyContent: 'center'}}>
                                        <Loader size="m" />
                                </Layout>
                        )}
                </Modal>
        )
}
export default ReturnModal;