import { ConfigService } from "@nestjs/config";
import { Address, Contract, ProviderRpcClient } from "everscale-inpage-provider";
import {
    EverscaleStandaloneClient,
    EverWalletAccount,
    SimpleAccountsStorage,
    SimpleKeystore
} from "everscale-standalone-client/nodejs";
import { CollectionContractArtifact } from "src/artifacts/CollectionContract";
import { MarketplaceContractArtifact } from "src/artifacts/MarketplaceContract";
import { Logger } from "@nestjs/common/services";

export class VenomIntegration {

    private collectionContract: Contract<typeof CollectionContractArtifact.ABI>;
    private marketplaceContract: Contract<typeof MarketplaceContractArtifact.ABI>;

    public static readonly EventNftMinted = 'NftMinted';
    public static readonly EventNftGenerated = 'NftGenerated';
    public static readonly EventNftListed = 'NftListed';
    public static readonly EventNftDelisted = 'NftDelisted';
    public static readonly EventNftSold = 'NftSold';
    public static readonly EventNftSalePriceSet = 'NftSalePriceSet';

    private readonly accountStorage = new SimpleAccountsStorage();
    private readonly keyStore = new SimpleKeystore();
    private readonly provider: ProviderRpcClient;
    private ownerAccount: EverWalletAccount;

    constructor(private configService: ConfigService) {
        this.provider = new ProviderRpcClient({
            fallback: () =>
                EverscaleStandaloneClient.create({
                    connection: {
                        id: 0,
                        type: 'graphql',
                        data: {
                            endpoints: ['localhost'],
                        },
                    },
                    keystore: this.keyStore,
                    accountsStorage: this.accountStorage
                }),
        });
    }

    async init() {
        Logger.log('Venom initializing...');

        const publicKey = this.configService.get<string>('OWNER_PUBLIC_KEY');
        const secretKey = this.configService.get<string>('OWNER_SECRET_KEY');
        const collectionContractAddress = this.configService.get<string>('COLLECTION_CONTRACT_ADDRESS');
        const marketplaceContractAddress = this.configService.get<string>('MARKETPLACE_CONTRACT_ADDRESS');

        this.ownerAccount = await EverWalletAccount.fromPubkey({ publicKey, workchain: 0 });
        this.accountStorage.addAccount(this.ownerAccount);

        this.keyStore.addKeyPair('owner', {
            publicKey,
            secretKey
        });

        // Initialize contracts and setup event listeners
        this.collectionContract = new this.provider.Contract(CollectionContractArtifact.ABI, new Address(collectionContractAddress));
        this.marketplaceContract = new this.provider.Contract(MarketplaceContractArtifact.ABI, new Address(marketplaceContractAddress));

        const collectionContractEvents = this.collectionContract.events(new this.provider.Subscriber());
        collectionContractEvents.on(async (contractEvent) => {
            if (contractEvent.event == VenomIntegration.EventNftMinted) {
                await this.processNftMintedEvent(contractEvent);
            } else if (contractEvent.event == VenomIntegration.EventNftGenerated) {
                await this.processNftGeneratedEvent(contractEvent);
            }
        });

        const marketplaceContractEvents = this.marketplaceContract.events(new this.provider.Subscriber());
        marketplaceContractEvents.on(async (contractEvent) => {
            switch (contractEvent.event) {
                case VenomIntegration.EventNftListed:
                    await this.processNftListedEvent(contractEvent);
                    break;
                case VenomIntegration.EventNftDelisted:
                    await this.processNftDelistedEvent(contractEvent);
                    break;
                case VenomIntegration.EventNftSalePriceSet:
                    await this.processNftSalePriceSetEvent(contractEvent);
                    break;
                case VenomIntegration.EventNftSold:
                    await this.processNftSoldEvent(contractEvent);
                    break;
            }
        });

        Logger.log('Venom client initialized...');
    }

    private async generateNft(id: number, json: string, minter: string) {
        const tx = await this.collectionContract.methods.generateNft({ id, json, minter } as never).send({
            from: this.ownerAccount.address,
            amount: "1000000000"
        });
        if (tx.aborted) {
            Logger.error('Unable to generate nft, transaction aborted!');
        } else {
            Logger.log('Nft generated succesfully');
        }
    }

    private async processNftMintedEvent(contractEvent: any) {
        Logger.log('Got NFT minted event, processing...');
        if (this.checkEventEmitted(contractEvent)) {
            Logger.log('Minted params: ', contractEvent.data);
            await this.generateNft(contractEvent.data.id, '{dummy json}', contractEvent.data.owner);
            Logger.log('NFT minted event processed !');
        } else {
            Logger.error('Failed to process NFT minted event!');
        }
    }

    private async processNftGeneratedEvent(contractEvent: any) {
        Logger.log('Got NFT generated event, processing...');
        if (this.checkEventEmitted(contractEvent)) {
            Logger.log('Generated params: ', contractEvent.data);
            Logger.log('NFT generated event processed !');
        } else {
            Logger.error('Failed to process NFT generated event!');
        }
    }

    private async processNftListedEvent(contractEvent: any) {
        Logger.log('Got NFT listed event, processing...');
        if (this.checkEventEmitted(contractEvent)) {
            Logger.log('Listed params: ', contractEvent.data);
            Logger.log('NFT listed event processed !');
        } else {
            Logger.error('Failed to process NFT listed event!');
        }
    }

    private async processNftDelistedEvent(contractEvent: any) {
        Logger.log('Got NFT delisted event, processing...');
        if (this.checkEventEmitted(contractEvent)) {
            Logger.log('Delisted params: ', contractEvent.data);
            Logger.log('NFT delisted event processed !');
        } else {
            Logger.error('Failed to process NFT delisted event!');
        }
    }

    private async processNftSalePriceSetEvent(contractEvent: any) {
        Logger.log('Got NFT sale price set event, processing...');
        if (this.checkEventEmitted(contractEvent)) {
            Logger.log('Sold params: ', contractEvent.data);
            Logger.log('NFT sold event processed !');
        } else {
            Logger.error('Failed to process NFT sold event!');
        }
    }

    private async processNftSoldEvent(contractEvent: any) {
        Logger.log('Got NFT sold event, processing...');
        if (this.checkEventEmitted(contractEvent)) {
            Logger.log('Sold params: ', contractEvent.data);
            Logger.log('NFT sold event processed !');
        } else {
            Logger.error('Failed to process NFT sold event!');
        }
    }

    private checkEventEmitted(contractEvent: any) {
        let success = true;
        try {
            if (contractEvent.transaction.aborted) {
                success = false;
                Logger.error('Event check failed. Transaction aborted.');
            }
        } catch (ex) {
            Logger.error(ex);
        } finally {
            return success;
        }
    }

}