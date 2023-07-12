import {BluetoothEscposPrinter} from '@brooons/react-native-bluetooth-escpos-printer';
import axios from 'axios';
import {useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {LOADING, REFRESH} from '../../../../Redux/Types/Commandes';
import {
  DELETE_MESSAGES_PRINTER,
  PRINTER_FAILED,
} from '../../../../Redux/Types/Printer';

import {API_URL_PROD, API_URL_DEV} from '@env';

export function useCommandes() {
  const dispatch = useDispatch();

  const Commandes = useSelector(state => state.Commandes);
  const {toComfirm, others, loading_btn, refresh, orders} = Commandes;
  const Printer = useSelector(state => state.Printer);
  const {isPrinter, nombreTicket} = Printer;

  const [status, setStatus] = useState('Toutes');
  const [Loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [IsChanged, setIsChanged] = useState(false);
  const [Visible, setVisible] = useState(false);

  const auth = useSelector(state => state.auth);
  const mergedArray = [...toComfirm, ...others];

  const {Token, login, establishments} = auth;
  const {width} = useWindowDimensions();

  let configHead = {
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': 'fr',
      Authorization: 'Bearer ' + Token,
      login: login?.login,
      establishment: establishments?.id,
    },
  };

  const GetProducts = async id => {
    dispatch({type: LOADING});
    // console.log("id", id);
    let body = JSON.stringify({
      orderId: id,
    });
    // let URL = 'https://devgab.live-resto.fr/apiv2e/orders/details';
    // let URL = "https://https://m2.live-resto.fr/apiv2e/orders/details";
    let API_BASE_URL;

    if (__DEV__) {
      API_BASE_URL = API_URL_DEV;
    } else {
      API_BASE_URL = API_URL_PROD;
    }

    let url = `${API_BASE_URL}/orders/details`;
    try {
      if (Token) {
        await axios
          .post(url, body, configHead)
          .then(res => {
            let Data = res.data.order;

            console.log('dataStatus--------------------', Data);
            // dispatch({ type: ORDER_SUCCESS, payload: Data });
          })
          .catch(err => {
            console.log('--- error failed', err);
            // dispatch({type: COMMANDES_FAILED});
          });
        // DesActiveLoading()
        // dispatch({ type: STOP_COMMANDES_LOADING });
      }
    } catch (error) {
      console.log('--- error failed', error);
    }
  };

  // Printers

  const doWihlePrintr = async item => {
    let i = 1;
    do {
      if (IsChanged && orders) {
        console.log(`title print`, i);
        console.log(`body print`, i);
        try {
          await BluetoothEscposPrinter.printerInit();
          await BluetoothEscposPrinter.printerLeftSpace(0);
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.setBlob(0);
          await BluetoothEscposPrinter.printText('______________________\r\n', {
            fonttype: 3,
            widthtimes: 1,
            heigthtimes: 1,
          });
          await BluetoothEscposPrinter.printText('Live Resto\r\n', {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 3,
            heigthtimes: 3,
            fonttype: 1,
          });
          await BluetoothEscposPrinter.setBlob(0);
          await BluetoothEscposPrinter.printText('#' + item.id + '\r\n', {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 3,
            heigthtimes: 3,
            fonttype: 1,
          });
          await BluetoothEscposPrinter.printText(
            '______________________________________\r\n',
            {
              fonttype: 1,
            },
          );
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.setBlob(0);
          await BluetoothEscposPrinter.printText(' Livraison \r\n', {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 3,
            heigthtimes: 3,
            fonttype: 1,
          });
          await BluetoothEscposPrinter.printText('\r\n', {});
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          // await BluetoothEscposPrinter.printText(
          //   'Client : ' +
          //     item.delivery.full_name +
          //     '  --  ' +
          //     item.delivery.phone +
          //     '\r\n',
          //   {},
          // );
          // await BluetoothEscposPrinter.printText(
          //   ' Adresse : ' + item.delivery.address + '  \r\n',
          //   {},
          // );

          // item?.delivery.address_extra !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     ' Addresse_extra : ' + item?.delivery.address_extra + '  \r\n',
          //     {},
          //   ));
          // item?.delivery.city !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'City : ' +
          //       item?.delivery.city +
          //       ' - ' +
          //       item?.delivery.postal +
          //       ' \r\n',
          //     {},
          //   ));

          // item?.delivery.floor !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'etage : ' + item?.delivery.floor + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.residence !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'residence : ' + item?.delivery.residence + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.building !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'building : ' + item?.delivery.building + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.apartment !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'apartment : ' + item?.delivery.apartment + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.code_doorbell !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'code_doorbell : ' + item?.delivery.code_doorbell + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.code_portal !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'code_portal : ' + item?.delivery.code_portal + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.code_building !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'code_building : ' + item?.delivery.code_building + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.code_elevator !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'code_elevator : ' + item?.delivery.code_elevator + ' \r\n',
          //     {},
          //   ));


          await BluetoothEscposPrinter.printText(
            'Client : ' +
              item.delivery.full_name +
              '  --  ' +
              item.delivery.phone +
              '\r\n',
            {},
          );
          await BluetoothEscposPrinter.printText(
            ' Adresse : ' + item.delivery.address + '  \r\n',
            {},
          );

          item?.delivery.city !== '' &&
            (await BluetoothEscposPrinter.printText(
              ' ' +
                item?.delivery.city +
                ' - ' +
                item?.delivery.postal +
                ' \r\n',
              {},
            ));
          item?.delivery.floor !== '' &&
            (await BluetoothEscposPrinter.printText(
              'Etage : ' + item?.delivery.floor + ' \r\n',
              {
                encoding: 'UTF-8',
              },
            ));
          item?.delivery.building !== '' &&
            (await BluetoothEscposPrinter.printText(
              'Immeuble : ' + item?.delivery.building + ' \r\n',
              {
                encoding: 'UTF-8',
              },
            ));
          item?.delivery.code_doorbell !== '' &&
            (await BluetoothEscposPrinter.printText(
              'Code sonette: ' + item?.delivery.code_doorbell + ' \r\n',
              {},
            ));
          item?.delivery.code_elevator !== '' &&
            (await BluetoothEscposPrinter.printText(
              'Code ascenceur : ' + item?.delivery.code_elevator + ' \r\n',
              {},
            ));

          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.printText(
            '______________________________________\r\n',
            {
              fonttype: 1,
            },
          );
          await BluetoothEscposPrinter.printText('\r\n', {});

          {
            orders && orders.length > 0
              ? orders.map(i => {
                  return BluetoothEscposPrinter.printColumn(
                    [38, 0, 8],
                    [
                      BluetoothEscposPrinter.ALIGN.LEFT,
                      BluetoothEscposPrinter.ALIGN.CENTER,
                      BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    [
                      '' + i._joinData.quantity + 'x ' + i.title + '',
                      '',
                      '' + i._joinData.price.toFixed(2) + ' €',
                    ],
                    {
                      encoding: 'windows-1254',
                      codepage: 25,
                      widthtimes: 0.75,
                      heigthtimes: 0.75,
                    },
                  );
                })
              : await BluetoothEscposPrinter.printText(
                  "Pas d'article .... \r\n",
                  {},
                );
          }
          //  test printer extars in line
          {
            orders && orders.length > 0
              ? orders.map(i => {
                  i._joinData.extras &&
                    i._joinData.extras.map(ext => {
                      return BluetoothEscposPrinter.printColumn(
                        [38, 0, 8],
                        [
                          BluetoothEscposPrinter.ALIGN.LEFT,
                          BluetoothEscposPrinter.ALIGN.CENTER,
                          BluetoothEscposPrinter.ALIGN.RIGHT,
                        ],
                        [
                          ext.option + ' :  ',
                          '' + ext.choice + '',
                          '' + ext.price + ' €',
                        ],
                        {
                          encoding: 'windows-1254',
                          codepage: 25,
                          widthtimes: 0.75,
                          heigthtimes: 0.75,
                        },
                      );
                    });
                })
              : await BluetoothEscposPrinter.printText(
                  'No article .... \r\n',
                  {},
                );
          }
          await BluetoothEscposPrinter.printText('\r\n', {});
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.setBlob(0);
          await BluetoothEscposPrinter.printText(
            " Nombre d'articles: " + orders.productsCount + '\r\n',
            {
              encoding: 'windows-1254',
              codepage: 25,
              widthtimes: 1,
              heigthtimes: 1,
              fonttype: 1,
            },
          );

          await BluetoothEscposPrinter.printText(
            '______________________________________\r\n',
            {
              fonttype: 1,
            },
          );
          // await BluetoothEscposPrinter.printColumn(
          //   [20, 2, 10],
          //   [
          //     BluetoothEscposPrinter.ALIGN.LEFT,
          //     BluetoothEscposPrinter.ALIGN.LEFT,
          //     BluetoothEscposPrinter.ALIGN.RIGHT,
          //   ],
          //   ['Moyen de paiement ', ':', '' + item.payments[0].title + ''],
          //   item?.payments[1].title &&  ['                  ', ':', '' + item?.payments[1].title + ''],
          //   item?.payments[2].title &&  ['                  ', ':', '' + item?.payments[2].title + ''],
          //   item?.payments[3].title &&  ['                  ', ':', '' + item?.payments[3].title + ''],
          //   {
          //     encoding: 'windows-1254',
          //     codepage: 25,
          //   },
          // );



          await BluetoothEscposPrinter.printColumn(
            [20, 2, 10],
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            [
              'Frais de Livraison',
              ':',
              '' + item.delivery_price.toFixed(2) + ' €',
            ],
            {
              encoding: 'windows-1254',
              codepage: 25,
            },
          );

          await BluetoothEscposPrinter.printColumn(
            [20, 2, 10],
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.CENTER,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['Remise :', '', '' + item.discount.toFixed(2) + ' € \r\n'],
            {
              encoding: 'windows-1254',
              codepage: 25,
            },
          );

          await BluetoothEscposPrinter.printColumn(
            [14, 0, 8],
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['Prix Total :', '', '' + item.total.toFixed(2) + ' €'],
            {
              encoding: 'windows-1254',
              codepage: 25,
              widthtimes: 1,
              heigthtimes: 1,
            },
          );

          await BluetoothEscposPrinter.printText(
            '_________________________________\r\n',
            {
              fonttype: 1,
              heigthtimes: 1,
            },
          );


          await BluetoothEscposPrinter.printText('\r\n', {});

          await BluetoothEscposPrinter.printColumn(
            [20, 2, 10],
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['Moyen de paiement ', ':', ''],
            {
              encoding: 'windows-1254',
              codepage: 25,
            },
          );
          {
            item?.payments && item?.payments.length > 0
              ? item?.payments.map(i => {
                  return BluetoothEscposPrinter.printColumn(
                    [38, 0, 8],
                    [
                      BluetoothEscposPrinter.ALIGN.LEFT,
                      BluetoothEscposPrinter.ALIGN.CENTER,
                      BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    [
                      '' + i.title + ' :',
                      '',
                      '' + i._joinData.amount.toFixed(2) + ' €',
                    ],
                    {
                      encoding: 'windows-1250',
                      codepage: 25,
                      widthtimes: 0.75,
                      heigthtimes: 0.75,
                    },
                  );
                })
              : await BluetoothEscposPrinter.printText(' \r\n', {});
          }
          await BluetoothEscposPrinter.printText('\r\n', {});
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.printText(
            "Merci d'avoir commandé chez Live Resto\r\n",
            {
              encoding: 'windows-1250',
              codepage: 25,
            },
          );

          await BluetoothEscposPrinter.printText(
            'UNE ENTREPRISE FRAN€AISE \r\n',
            {
              // Western European (Windows)
              //  encoding: 'Windows-1253',
              //  encoding: 'Utf-8',
              encoding: 'GBK',

              // codepage: 25,
            },
          );
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
          await BluetoothEscposPrinter.printText('  \r\n', {
            encoding: 'windows-1250',
            codepage: 25,
            widthtimes: 3,
            heigthtimes: 3,
            fonttype: 1,
          });
        } catch (error) {
          dispatch({type: PRINTER_FAILED, payload: "l'impression échoué"});
          setTimeout(() => {
            dispatch({type: DELETE_MESSAGES_PRINTER});
          }, 5000);
          alert(error);
        }

        setIsDone(true);
        console.log('is Done .... ', item.id);
        console.log('item.discount .... ', item.discount);
        if (orders && orders.length > 0) {
          orders?.map(i => {
            console.log('----------------------', i.title);
          });
        }
      }
      if (isDone) {
        await BluetoothEscposPrinter.cutOnePoint();
        // console.log('nombreTicket', nombreTicket);
        console.log(`cut priint`, i);
        console.log('orders.productsCount', orders.productsCount);
        console.log(`-----------`);
        if (i <= nombreTicket) {
          setIsChanged(true);

          console.log('is change .... ');
        } else {
          setIsChanged(false);
        }
      }
      i++;
    } while (i <= nombreTicket);
  };
  const PrinteById = async (item, ordersById, nombreArticl) => {
    let i = 1;
    do {
      if (IsChanged && ordersById && ordersById.length > 0) {
        // console.log(`title print`, i);
        // console.log(`body print`, i);
        // console.log(`ordersById`, ordersById);
        try {
          await BluetoothEscposPrinter.printerInit();
          await BluetoothEscposPrinter.printerLeftSpace(0);
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.setBlob(0);
          await BluetoothEscposPrinter.printText('______________________\r\n', {
            fonttype: 3,
            widthtimes: 1,
            heigthtimes: 1,
          });
          await BluetoothEscposPrinter.printText('Live Resto\r\n', {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 3,
            heigthtimes: 3,
            fonttype: 1,
          });
          await BluetoothEscposPrinter.setBlob(0);
          await BluetoothEscposPrinter.printText('#' + item?.id + '\r\n', {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 3,
            heigthtimes: 3,
            fonttype: 1,
          });
          await BluetoothEscposPrinter.printText(
            '______________________________________\r\n',
            {
              fonttype: 1,
            },
          );
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.setBlob(0);
          await BluetoothEscposPrinter.printText(' Livraison \r\n', {
            encoding: 'GBK',
            codepage: 0,
            widthtimes: 3,
            heigthtimes: 3,
            fonttype: 1,
          });
          await BluetoothEscposPrinter.printText('\r\n', {});
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          // await BluetoothEscposPrinter.printText(
          //   'Client : ' +
          //     item?.delivery.full_name +
          //     '  --  ' +
          //     item?.delivery.phone +
          //     '\r\n',
          //   {},
          // );
          // await BluetoothEscposPrinter.printText(
          //   ' Adresse : ' + item?.delivery.address + '  \r\n',
          //   {},
          // );
          // item?.delivery.address_extra !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     ' Addresse_extra : ' + item?.delivery.address_extra + '  \r\n',
          //     {},
          //   ));
          // item?.delivery.city !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'City : ' +
          //       item?.delivery.city +
          //       ' - ' +
          //       item?.delivery.postal +
          //       ' \r\n',
          //     {},
          //   ));

          // item?.delivery.floor !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'etage : ' + item?.delivery.floor + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.residence !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'residence : ' + item?.delivery.residence + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.building !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'building : ' + item?.delivery.building + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.apartment !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'apartment : ' + item?.delivery.apartment + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.code_doorbell !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'code_doorbell : ' + item?.delivery.code_doorbell + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.code_portal !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'code_portal : ' + item?.delivery.code_portal + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.code_building !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'code_building : ' + item?.delivery.code_building + ' \r\n',
          //     {},
          //   ));
          // item?.delivery.code_elevator !== '' &&
          //   (await BluetoothEscposPrinter.printText(
          //     'code_elevator : ' + item?.delivery.code_elevator + ' \r\n',
          //     {},
          //   ));

          await BluetoothEscposPrinter.printText(
            'Client : ' +
              item.delivery.full_name +
              '  --  ' +
              item.delivery.phone +
              '\r\n',
            {},
          );
          await BluetoothEscposPrinter.printText(
            ' Adresse : ' + item.delivery.address + '  \r\n',
            {},
          );

          item?.delivery.city !== '' &&
            (await BluetoothEscposPrinter.printText(
              ' ' +
                item?.delivery.city +
                ' - ' +
                item?.delivery.postal +
                ' \r\n',
              {},
            ));
          item?.delivery.floor !== '' &&
            (await BluetoothEscposPrinter.printText(
              'Etage : ' + item?.delivery.floor + ' \r\n',
              {
                encoding: 'UTF-8',
              },
            ));
          item?.delivery.building !== '' &&
            (await BluetoothEscposPrinter.printText(
              'Immeuble : ' + item?.delivery.building + ' \r\n',
              {
                encoding: 'UTF-8',
              },
            ));
          item?.delivery.code_doorbell !== '' &&
            (await BluetoothEscposPrinter.printText(
              'Code sonette: ' + item?.delivery.code_doorbell + ' \r\n',
              {},
            ));
          item?.delivery.code_elevator !== '' &&
            (await BluetoothEscposPrinter.printText(
              'Code ascenceur : ' + item?.delivery.code_elevator + ' \r\n',
              {},
            ));
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.printText(
            '______________________________________\r\n',
            {
              fonttype: 1,
            },
          );
          await BluetoothEscposPrinter.printText('\r\n', {});

          {
            ordersById.map(i => {
              return (
                BluetoothEscposPrinter.printColumn(
                  [38, 0, 8],
                  [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.CENTER,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                  ],
                  [
                    '' + i?._joinData.quantity + 'x ' + i?.title + '',
                    '',
                    '' + i?._joinData.price.toFixed(2) + ' €',
                  ],
                  {
                    encoding: 'windows-1254',
                    codepage: 25,
                    widthtimes: 0.75,
                    heigthtimes: 0.75,
                  },
                ),
                i._joinData.extras &&
                  i._joinData.extras.map(ext => {
                    return (
                      BluetoothEscposPrinter.printerAlign(
                        BluetoothEscposPrinter.ALIGN.LEFT,
                      ),
                      BluetoothEscposPrinter.printText(
                        ext.option + ' :  ' + ext.choice + '\r\n',
                        {
                          encoding: 'windows-1254',
                          codepage: 25,
                        },
                      )
                    );
                  }),
                BluetoothEscposPrinter.printText('\r\n', {})
              );
            });
          }

          await BluetoothEscposPrinter.printText('\r\n', {});
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.setBlob(0);
          await BluetoothEscposPrinter.printText(
            " Nombre d'articles: " + nombreArticl + '\r\n',
            {
              encoding: 'windows-1254',
              codepage: 25,
              widthtimes: 1,
              heigthtimes: 1,
              fonttype: 1,
            },
          );

          await BluetoothEscposPrinter.printText(
            '______________________________________\r\n',
            {
              fonttype: 1,
            },
          );

        

          // await BluetoothEscposPrinter.printColumn(
          //   [20, 2, 10],
          //   [
          //     BluetoothEscposPrinter.ALIGN.LEFT,
          //     BluetoothEscposPrinter.ALIGN.LEFT,
          //     BluetoothEscposPrinter.ALIGN.RIGHT,
          //   ],
          //   ['Moyen de paiement ', ':', '' + item?.payments[0].title + ''],
          //   item?.payments[1].title &&  ['                  ', ':', '' + item?.payments[1].title + ''],
          //   item?.payments[2].title &&  ['                  ', ':', '' + item?.payments[2].title + ''],
          //   item?.payments[3].title &&  ['                  ', ':', '' + item?.payments[3].title + ''],
          //   {
          //     encoding: 'windows-1250',
          //     codepage: 25,
          //   },
          // );
          await BluetoothEscposPrinter.printColumn(
            [20, 2, 10],
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            [
              'Frais de Livraison',
              ':',
              '' + item?.delivery_price.toFixed(2) + ' €',
            ],
            {
              encoding: 'windows-1254',
              codepage: 25,
            },
          );

          await BluetoothEscposPrinter.printColumn(
            [20, 2, 10],
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.CENTER,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['Remise :', '', '' + item?.discount.toFixed(2) + ' € \r\n'],
            {
              encoding: 'windows-1254',
              codepage: 25,
            },
          );

          await BluetoothEscposPrinter.printColumn(
            [14, 0, 8],
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['Prix Total :', '', '' + item?.total.toFixed(2) + ' €'],
            {
              encoding: 'windows-1254',
              codepage: 25,
              widthtimes: 1,
              heigthtimes: 1,
            },
          );
          await BluetoothEscposPrinter.printText('\r\n', {});

          await BluetoothEscposPrinter.printColumn(
            [20, 2, 10],
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            ['Moyen de paiement ', ':', ''],
            {
              encoding: 'windows-1254',
              codepage: 25,
            },
          );
          {
            item?.payments && item?.payments.length > 0
              ? item?.payments.map(i => {
                  return BluetoothEscposPrinter.printColumn(
                    [38, 0, 8],
                    [
                      BluetoothEscposPrinter.ALIGN.LEFT,
                      BluetoothEscposPrinter.ALIGN.CENTER,
                      BluetoothEscposPrinter.ALIGN.RIGHT,
                    ],
                    [
                      '' + i.title + ' :',
                      '',
                      '' + i._joinData.amount.toFixed(2) + ' €',
                    ],
                    {
                      encoding: 'windows-1250',
                      codepage: 25,
                      widthtimes: 0.75,
                      heigthtimes: 0.75,
                    },
                  );
                })
              : await BluetoothEscposPrinter.printText(' \r\n', {});
          }

          await BluetoothEscposPrinter.printText(
            '_________________________________\r\n',
            {
              fonttype: 1,
              heigthtimes: 1,
            },
          );
          await BluetoothEscposPrinter.printText('\r\n', {});
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.printText(
            "Merci d'avoir commandé chez Live Resto\r\n",
            {
              encoding: 'windows-1250',
              codepage: 25,
            },
          );

          await BluetoothEscposPrinter.printText(
            'UNE ENTREPRISE FRAN€AISE \r\n',
            {
              encoding: 'GBK',
            },
          );
          await BluetoothEscposPrinter.printerAlign(
            BluetoothEscposPrinter.ALIGN.CENTER,
          );
          await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
          await BluetoothEscposPrinter.printText('  \r\n', {
            encoding: 'windows-1250',
            codepage: 25,
            widthtimes: 3,
            heigthtimes: 3,
            fonttype: 1,
          });
        } catch (error) {
          dispatch({
            type: PRINTER_FAILED,
            payload: 'COMMANDE NON IMPRIMÉE !',
          });
          setTimeout(() => {
            dispatch({type: DELETE_MESSAGES_PRINTER});
          }, 5000);
          alert(error);
        }
        setIsDone(true);

        // console.log(
        //   "Frais de Livraison",
        //   ":",
        //   "" + item.delivery_price.toFixed(2) + " €"
        // );
        // console.log("Moyen de paiment : ", item.payments[0].title);
        // console.log("item.discount", item.discount);
        // console.log("is Done .... ", item.id);
        // console.log("Remise", item.discount.toFixed(2));
        // if (ordersById && ordersById.length > 0) {
        //   ordersById?.map((i) => {
        //     console.log("----------------------", i.title);
        //     // i._joinData.extras && console.log('----------------------', i._joinData.extras);
        //     i._joinData.extras &&
        //       i._joinData.extras.map((ext) => {
        //         return console.log(
        //           "----------------------",
        //           ext.choice,
        //           "prix ****",
        //           ext.price
        //         );
        //       });
        //   });
        // }
        // console.log("Prix Total :", "", "" + item.total.toFixed(2) + " €");
        // console.log( " Nombre d'articles: " , nombreArticl)
      }
      if (isDone) {
        await BluetoothEscposPrinter.cutOnePoint();
        // console.log(`cut priint`, i);
        // console.log(`-----------`);
        if (i <= nombreTicket) {
          setIsChanged(true);

          // console.log("is change .... ");
        } else {
          setIsChanged(false);
        }
      }
      i++;
    } while (i <= nombreTicket);
  };

  const AcitvePopUp = () => {
    setVisible(true);
  };
  const DesAcitvePopUp = () => {
    setVisible(false);
  };
  const ActiveLoading = () => {
    setLoading(true);
  };
  const DesActiveLoading = () => {
    setLoading(false);
  };

  const GetOrdersOnClick = async (id, item) => {
    ActiveLoading();

    let body = JSON.stringify({
      orderId: id,
    });
    // let URL = "https://m2.live-resto.fr/apiv2e/orders/details";

    let API_BASE_URL;

    if (__DEV__) {
      API_BASE_URL = API_URL_DEV;
    } else {
      API_BASE_URL = API_URL_PROD;
    }

    let url = `${API_BASE_URL}/orders/details`;

    try {
      if (Token) {
        await fetch(url, {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: 'Bearer ' + Token,
            login: login?.login,
            establishment: establishments?.id,
          },
          body,
        })
          .then(res => res.json())
          .then(dataStatus => {
            setIsDone(true),
              setIsChanged(true),
              PrinteById(
                item,
                dataStatus.order.products,
                dataStatus.order.productsCount,
              );
          })
          .catch(err => {
            console.log('--- error fey', err);
            // dispatch({type: COMMANDES_FAILED});
          });
        dispatch({type: REFRESH});
      }
    } catch (error) {
      console.log('--- error fey', error);
    }
  };

  return {
    toComfirm,
    setStatus,
    status,
    GetProducts,
    Token,
    orders,
    mergedArray,
    ToCuisine,
    configHead,
    ToDeliv,
    loading_btn,
    isPrinter,
    OnClick,
    Visible,
    DesAcitvePopUp,
    refresh,
    OnPrete,
    Loading,

    doWihlePrintr,
    AcitvePopUp,
    GetOrdersOnClick,
    ActiveLoading,
    DesActiveLoading,
    PrinteById,
    width,
    dispatch,
  };
}
