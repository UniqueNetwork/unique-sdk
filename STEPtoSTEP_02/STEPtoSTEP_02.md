**Add NFT-selling to classic market [03]**



Для подключения маркетплейса к блокчейну Polkadot нам понадобится REST-api(unique-SDK) для работы с инфраструктурой Unique ([ ](https://github.com/UniqueNetwork/unique-sdk)<https://github.com/UniqueNetwork/unique-sdk> ).

Так же необходимо ознакомится с соответствующими методами данной библиотеки ([ ](https://github.com/UniqueNetwork/unique-sdk/blob/develop/packages/web/README.md)<https://github.com/UniqueNetwork/unique-sdk/blob/develop/packages/web/README.md> ) .

Примеры методов так же доступны в Swagger ([ ](https://web.uniquenetwork.dev/swagger/#/)<https://web.uniquenetwork.dev/swagger/#/>  ).

Отдельно существует библиотека для загрузки изображений для NFT, откуда нам будет необходим один метод:

<https://image-uploader.unique.network/api/docs/>

Предварительно, необходимо предусмотреть кнопку или ссылку на ресурсе маркетплейса для покупки NFT около(под) изображения физической(реальной) картины.

Так же, для того чтобы подключится к блокчейну Polkadot, необходимо создать для своего ресурса субстратный адрес (**ШАГ 1**). Процедура регистрации происходит отдельно по адресу[ ](https://polkadot.js.org/)[https://polkadot.js.org](https://polkadot.js.org/) или <https://wallet.unique.network/> .

После регистрации на Polkadot.JS появляется возможность создавать свои коллекции. Необходимо создать свою коллекцию для существующей картинной галереи в соответствии с правилом «Картина – цифровой токен NFT» **(ШАГ 2)**.

Процедурно последовательность делится на следующие шаги:

- минтинг коллекции (сминтенную коллекцию можно смотреть тут: <https://minter-quartz.unique.network/>  )
- минтинг/отправка токена - подтверждение отправки токена тут ( [https://uniquescan.io/QUARTZ](https://uniquescan.io/) )
- для тестирования можно использовать тестовую сеть Опал ( <https://wallet.dev.uniquenetwork.dev>, <https://minter-opal.unique.network/> и <https://wallet-opal.unique.network/> )
- чтобы получить средства на опале - воспользуйтесь ботом ( <https://t.me/unique2faucet_opal_bot> )

Пример создания коллекции:

Процедурно:

- формирование экстринзика (<https://web.uniquenetwork.dev/swagger/#/extrinsic/ExtrinsicsController_buildTx> )
- подпись экстринзика (<https://web.uniquenetwork.dev/swagger/#/extrinsic/ExtrinsicsController_sign>  )
- отправка экстринзика в чейн (<https://web.uniquenetwork.dev/swagger/#/extrinsic/ExtrinsicsController_submitTx> )

метод POST \collection

<https://github.com/UniqueNetwork/uniquesdk/blob/develop/packages/web/README.md>  

Swagger:

<https://web.uniquenetwork.dev/swagger/#/collection/CollectionController_createCollection>

Далее, мы создаем цифровой токен, для чего используем метод POST \api\images\upload ([ ](https://image-uploader.unique.network/api/docs/#/default/ImageController_uploadImage)<https://image-uploader.unique.network/api/docs/#/default/ImageController_uploadImage> ) и сначала загружаем изображение, получаем зашифрованную ссылку на изображение (**ШАГ 3.1)**

И далее посредством метода POST \Token (пример:[ ](https://web.uniquenetwork.dev/swagger/#/token/TokenController_createToken)<https://web.uniquenetwork.dev/swagger/#/token/TokenController_createToken> ) (**ШАГ 3.2**), используя полученную ранее зашифрованную ссылку на изображение – создаем токен данного изображения, NFT готово к продаже на маркетплейсе.

Требования к покупателю NFT.

У покупателя NFT также должен быть в наличии субстратный адрес в сети Polkadot\Unique (Регистрация на[ ](https://polkadot.js.org/)[https://polkadot.js.org](https://polkadot.js.org/) ). Иначе, создание субстратного адреса производится по аналогии **( ссылка на пример работы - <https://wallet.dev.uniquenetwork.dev> - JS( ждемс ).**

В меню покупки NFT необходимо предусмотреть поле ввода субстратного адреса клиента, на который будет поступать токен, после оплаты за фиат.

Механизм покупки предполагается следующий:

\- клиент выбирает NFT, которую хотел бы приобрести;

\- открывается меню куда он вводит свой субстратный адрес и данные для оплаты за фиат;

\- клиент оплачивает покупку фиатами и на его субстратный адрес поступает NFT.

В это время происходит создание токена ( **ШАГ 1- 3.2** ) и далее:

\- при поступлении фиатов на счет продавца осуществляется трансфер прав владения NFT от субстратного адреса продавца на субстратный адрес, указанный покупателем. (метод PATCH \token\transfer) - аналогично созданию токена: 

**- сформировать экстринзика**  

\- **подписать** 

\- **отправить в чейн**

Пример трансфера приведен в Swagger -[ ](https://web.uniquenetwork.dev/swagger/#/token/TokenController_transferToken)<https://web.uniquenetwork.dev/swagger/#/token/TokenController_transferToken> .

СОЗДАТЬ КОЛЛЕКЦИЮ (через веб)

Авторизоваться в минтере <https://minter-quartz.unique.network/#/builder/collections> 

Убедиться, что на счете есть средства и нажать кнопку “Create collection”

![](Aspose.Words.4e630db7-38f7-470a-ac60-27aa127733b6.001.png)


Заполнить необходимые поля и нажать кнопку “Confirm”

![](Aspose.Words.4e630db7-38f7-470a-ac60-27aa127733b6.002.png)

Выбрать и загрузить изображение до 10 мб и нажать кнопку “Confirm”

![](Aspose.Words.4e630db7-38f7-470a-ac60-27aa127733b6.003.png)



Заполнить необходимые поля и нажать кнопку “Confirm”

![](Aspose.Words.4e630db7-38f7-470a-ac60-27aa127733b6.004.png)

Подписать транзакцию введя пароль и нажав кнопку “Sign and Submit”

![](Aspose.Words.4e630db7-38f7-470a-ac60-27aa127733b6.005.png)

СОЗДАТЬ НФТ  (через веб)

Теперь у нас есть созданная коллекция, для которой мы можем создать нашу первую NFT, нажав на кнопку “Create NFT”

![](Aspose.Words.4e630db7-38f7-470a-ac60-27aa127733b6.006.png)

Загрузить изображение и заполнить поля, после чего нажать кнопку “Confirm”

![](Aspose.Words.4e630db7-38f7-470a-ac60-27aa127733b6.007.png)

Подписать транзакцию введя пароль и нажав кнопку “Sign and Submit”

![](Aspose.Words.4e630db7-38f7-470a-ac60-27aa127733b6.008.png)

Теперь в нашей коллекции 1 итем

![](Aspose.Words.4e630db7-38f7-470a-ac60-27aa127733b6.009.png)






Если мы хотим просмотреть наш токен - необохидмо авторизоваться в воллете по ссылке <https://wallet.unique.network/#/myStuff/nft> 

![](Aspose.Words.4e630db7-38f7-470a-ac60-27aa127733b6.010.png)

Нажимаем на изображение токена и открываем полный список параметров

![](Aspose.Words.4e630db7-38f7-470a-ac60-27aa127733b6.011.png)


