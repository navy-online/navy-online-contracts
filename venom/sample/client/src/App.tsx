import { Address, ProviderRpcClient } from "everscale-inpage-provider";
import { EverscaleStandaloneClient, } from "everscale-standalone-client";
import { useEffect, useState } from "react";

import { VenomConnect } from "venom-connect";

import collectionContractAbi from "./abi/collection.abi.json";
import nftContractAbi from "./abi/nft.abi.json";
import marketplaceContractAbi from "./abi/marketplace.abi.json";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

const initTheme = "light" as const;

const standaloneFallback = () =>
  EverscaleStandaloneClient.create({
    connection: {
      id: 0,
      group: "Local Node (GQL)",
      type: "graphql",
      data: {
        endpoints: ["localhost"],
      },
    }
  });

const initVenomConnect = async () => {
  return new VenomConnect({
    theme: initTheme,
    checkNetworkId: 0,
    providersOptions: {
      venomwallet: {
        links: {
        },
        walletWaysToConnect: [
          {
            // NPM package
            package: ProviderRpcClient,
            packageOptions: {
              fallback:
                VenomConnect.getPromise("venomwallet", "extension") ||
                (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true,
            },

            // Setup
            id: "extension",
            type: "extension",
          },
        ],
        defaultWalletWaysToConnect: [
          // List of enabled options
          "mobile",
          "ios",
          "android",
        ],
      },
    },
  });
};

const themesList = ["light", "dark", "venom"];

const collectionContractAddress = new Address('0:dbcdf5d43044c8039fc34fcf8e695f10774ef942b10f93bd9c78513761c518de');
const marketplaceContractAddress = new Address('0:cbbf186d81f7acda4180f1e0e3d4b163ea0b5b1c6246d8c74a4332436316034a');

const App = () => {
  const [venomConnect, setVenomConnect] = useState<any>();
  const [venomProvider, setVenomProvider] = useState<any>();
  const [address, setAddress] = useState();
  const [balance, setBalance] = useState();
  const [theme, setTheme] = useState(initTheme);
  const [info, setInfo] = useState("");
  const [standaloneMethodsIsFetching, setStandaloneMethodsIsFetching] = useState(false);

  const getTheme = () =>
    venomConnect?.getInfo()?.themeConfig?.name?.toString?.() || "...";

  const onToggleThemeButtonClick = async () => {
    const currentTheme = getTheme();

    const lastIndex = themesList.length - 1;

    const currentThemeIndex = themesList.findIndex(
      (item) => item === currentTheme
    );

    const theme =
      currentThemeIndex >= lastIndex || !~currentThemeIndex || !~lastIndex
        ? themesList[0]
        : themesList[currentThemeIndex + 1];

    await venomConnect?.updateTheme(theme);

    setTheme(getTheme());
  };

  const getAddress = async (provider: any) => {
    const providerState = await provider?.getProviderState?.();

    const address =
      providerState?.permissions.accountInteraction?.address.toString();

    return address;
  };

  const getBalance = async (provider: any, _address: string) => {
    try {
      const providerBalance = await provider?.getBalance?.(_address);

      return providerBalance;
    } catch (error) {
      return undefined;
    }
  };

  const checkAuth = async (_venomConnect: any) => {
    const auth = await _venomConnect?.checkAuth();
    if (auth) await getAddress(_venomConnect);
  };

  const onInitButtonClick = async () => {
    const initedVenomConnect = await initVenomConnect();
    setVenomConnect(initedVenomConnect);

    await checkAuth(initedVenomConnect);
  };

  const onConnectButtonClick = async () => {
    venomConnect?.connect();
  };

  const onDisconnectButtonClick = async () => {
    venomProvider?.disconnect();
  };

  const check = async (_provider: any) => {
    const _address = _provider ? await getAddress(_provider) : undefined;
    const _balance =
      _provider && _address ? await getBalance(_provider, _address) : undefined;

    setAddress(_address);
    setBalance(_balance);

    if (_provider && _address)
      setTimeout(() => {
        check(_provider);
      }, 100);
  };

  const onConnect = async (provider: any) => {
    setVenomProvider(provider);

    check(provider);
  };

  useEffect(() => {
    const off = venomConnect?.on("connect", onConnect);

    return () => {
      off?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venomConnect]);


  // let collectionContract: any;
  // let marketplaceContract: any;

  const onGetCollectionInfoCall = async () => {
    if (venomProvider) {
      const collectionContract = new venomProvider.Contract(collectionContractAbi, collectionContractAddress);

      setStandaloneMethodsIsFetching(true);

      const collectionTotalSupply: any = await collectionContract.methods.totalSupply({ answerId: 0 } as never).call();
      const collectionSize: any = await collectionContract.methods.collectionSize({} as never).call();
      const collectionMintState: any = await collectionContract.methods.mintState({} as never).call();
      const collectionmintPrice: any = await collectionContract.methods.mintPrice({} as never).call();

      const collectionInfo = {
        totalSupply: collectionTotalSupply.count,
        collectionSize: collectionSize.collectionSize,
        mintState: collectionMintState.mintState,
        mintPrice: collectionmintPrice.mintPrice
      };

      setInfo(JSON.stringify(collectionInfo, null, 2));
    } else {
      alert("Provider is not available now");
    }

    setStandaloneMethodsIsFetching(false);
  };

  const onChangeMintStateCall = async () => {
    if (venomProvider) {
      const collectionContract = new venomProvider.Contract(collectionContractAbi, collectionContractAddress);
      await collectionContract.methods.changeMintState({ _mintState: 2 } as never).send({ from: address!, amount: '1000000000' });
    } else {
      alert("Provider is not available now");
    }
  };

  const onMintNftCall = async () => {
    if (venomProvider) {
      const collectionContract = new venomProvider.Contract(collectionContractAbi, collectionContractAddress);
      await collectionContract.methods.mintNft({} as never).send({ from: address!, amount: '1500000000' });
    } else {
      alert("Provider is not available now");
    }
  };

  const onListNftCall = async () => {
    if (venomProvider) {
      const nft = await getNftById(1);
      await nft.nftContract.methods.transfer({
        to: marketplaceContractAddress,
        sendGasTo: address,
        // I have no idea why value is 0.1 ton... just copy/pasted it from some example.
        callbacks: [[marketplaceContractAddress, { value: "100000000", payload: "" }]]
      }).send({
        from: address,
        amount: "1000000000"
      });
    } else {
      alert("Provider is not available now");
    }
  };

  const onDelistNftCall = async () => {
    if (venomProvider) {
      const nft = await getNftById(1);
      const marketplaceContract = new venomProvider.Contract(marketplaceContractAbi, marketplaceContractAddress);
      await marketplaceContract.methods.delistNft({ nftAddress: nft.nftAddress } as never)
        .send({ from: address, amount: '1000000000' });
    } else {
      alert("Provider is not available now");
    }
  };

  const onStartNftSaleCall = async () => {
    if (venomProvider) {
      const nft = await getNftById(1);
      const marketplaceContract = new venomProvider.Contract(marketplaceContractAbi, marketplaceContractAddress);
      await marketplaceContract.methods.startNftSelling({ nftAddress: nft.nftAddress, price: "1000000000" } as never)
        .send({ from: address, amount: '1000000000' });
    } else {
      alert("Provider is not available now");
    }
  };

  const onBuyNftCall = async () => {
    if (venomProvider) {
      const nft = await getNftById(1);
      const marketplaceContract = new venomProvider.Contract(marketplaceContractAbi, marketplaceContractAddress);
      await marketplaceContract.methods.buyNft({ nftAddress: nft.nftAddress } as never)
        .send({ from: address, amount: '1500000000' });
    } else {
      alert("Provider is not available now");
    }
  };

  const getNftById = async (id: number) => {
    const collectionContract = new venomProvider.Contract(collectionContractAbi, collectionContractAddress);
    const { nft: nftAddress } = await collectionContract.methods.nftAddress({ answerId: 0, id }).call();
    const nftContract = new venomProvider.Contract(nftContractAbi, nftAddress);
    return {
      nftAddress,
      nftContract
    }
  };

  return (
    <Box>
      <Grid container justifyContent="center" my={4}>
        <Grid item>
          <Typography variant="h1" component="h1" textAlign="center">
            Example
          </Typography>
        </Grid>
      </Grid>
      <Container>
        {!venomConnect && (
          <Grid
            container
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
          >
            <Grid item>
              <>
                <Button variant="contained" onClick={onInitButtonClick}>
                  Init lib
                </Button>
              </>
            </Grid>
          </Grid>
        )}
        {venomConnect && (
          <Grid container direction={"column"} gap={6}>
            <Grid item>
              <Grid container gap={1} justifyContent={"center"}>
                <Typography variant="h5" component="h2">
                  Theme: <i>{theme}</i>
                </Typography>
                <Button variant="outlined" onClick={onToggleThemeButtonClick}>
                  Toggle theme
                </Button>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                direction={"column"}
                alignItems={"center"}
                gap={2}
              >
                <Typography variant="h5" component="span">
                  You can use:
                </Typography>

                <Grid item>
                  {venomConnect && !address && (
                    <Button variant="contained" onClick={onConnectButtonClick}>
                      Connect via pop up
                    </Button>
                  )}
                  {venomConnect && !!address && (
                    <Button
                      variant="contained"
                      onClick={onDisconnectButtonClick}
                    >
                      Disconnect
                    </Button>
                  )}
                </Grid>

                <Grid item>
                  <Typography variant="h5" component="span">
                    or
                  </Typography>
                </Grid>
                <Grid item>
                  {venomConnect && (
                    <Button variant="contained" onClick={onGetCollectionInfoCall}>
                      Get collection info
                    </Button>
                  )}
                </Grid>
                <Grid item>
                  {venomConnect && (
                    <Button variant="contained" onClick={onChangeMintStateCall}>
                      Change mint state
                    </Button>
                  )}
                </Grid>
                <Grid item>
                  {venomConnect && (
                    <Button variant="contained" onClick={onMintNftCall}>
                      Mint NFT
                    </Button>
                  )}
                </Grid>
                <Grid item>
                  {venomConnect && (
                    <Button variant="contained" onClick={onListNftCall}>
                      List NFT on the marketplace
                    </Button>
                  )}
                </Grid>
                <Grid item>
                  {venomConnect && (
                    <Button variant="contained" onClick={onDelistNftCall}>
                      Delist NFT from the marketplace
                    </Button>
                  )}
                </Grid>
                <Grid item>
                  {venomConnect && (
                    <Button variant="contained" onClick={onStartNftSaleCall}>
                      Start NFT selling on the marketplace
                    </Button>
                  )}
                </Grid>
                <Grid item>
                  {venomConnect && (
                    <Button variant="contained" onClick={onBuyNftCall}>
                      Buy NFT on the marketplace
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Grid container direction={"column"} gap={2}>
                <Grid item>
                  <Typography
                    variant="h5"
                    component="h2"
                    style={{
                      wordBreak: "break-word",
                    }}
                  >
                    Address:{" "}
                    <i
                      style={{
                        fontSize: "smaller",
                      }}
                    >
                      {address}
                    </i>
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item>
                  <Typography
                    variant="h5"
                    component="h2"
                    style={{
                      wordBreak: "break-word",
                    }}
                  >
                    Balance:{" "}
                    <i
                      style={{
                        fontSize: "smaller",
                      }}
                    >
                      {balance ? (balance / 10 ** 9).toFixed(2) : undefined}
                    </i>
                  </Typography>
                  <Divider />
                </Grid>
                <Grid item>
                  {`Collection info:`}
                  <pre>
                    {(standaloneMethodsIsFetching ? (
                      <i>Standalone request in progress</i>
                    ) : (
                      info
                    )) || <span>&nbsp;</span>}
                  </pre>
                  <Divider />
                </Grid>
                <Grid item>
                  <Typography variant="h5" component="span">
                    User agent:{" "}
                    <i
                      style={{
                        fontSize: "smaller",
                      }}
                    >
                      {window.navigator.userAgent}
                    </i>
                  </Typography>

                  <Divider />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default App;
