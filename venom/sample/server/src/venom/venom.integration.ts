import { ConfigService } from "@nestjs/config";
import { Address, Contract, ProviderRpcClient } from "everscale-inpage-provider";
import {
    EverscaleStandaloneClient,
    EverWalletAccount,
    SimpleAccountsStorage,
    SimpleKeystore
} from "everscale-standalone-client/nodejs";

import { CollectionContractArtifact } from "src/artifacts/CollectionContract";
import { Logger } from "@nestjs/common/services";

export class VenomIntegration {

    private collectionContract: Contract<typeof CollectionContractArtifact.ABI>;
    private readonly COLLECTION_EVENT_NFT_MINTED = 'NftMinted';
    private readonly COLLECTION_EVENT_NFT_GENERATED = 'NftGenerated';

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

        this.ownerAccount = await EverWalletAccount.fromPubkey({ publicKey, workchain: 0 });
        this.accountStorage.addAccount(this.ownerAccount);

        this.keyStore.addKeyPair('owner', {
            publicKey,
            secretKey
        });

        // Initialize contracts and setup event listeners
        this.collectionContract = new this.provider.Contract(CollectionContractArtifact.ABI, new Address(collectionContractAddress));

        const contractEvents = this.collectionContract.events(new this.provider.Subscriber());
        contractEvents.on(async (contractEvent) => {
            if (contractEvent.event == this.COLLECTION_EVENT_NFT_MINTED) {
                await this.processNftMintedEvent(contractEvent);
            } else if (contractEvent.event == this.COLLECTION_EVENT_NFT_GENERATED) {
                await this.processNftGeneratedEvent(contractEvent);
            }
        });

        Logger.log('Venom client initialized...');

        await this.generateNft(1, '{ownerAddress}', '0:d3d74c409a8961c335d2111e1f64c7daa0dd40835aab5e0b500de91b4be8083e');
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
            await this.generateNft(contractEvent.data.id, '{dummy json}', contractEvent.data.owner);
            Logger.log('Minted nft event processed !');
        } else {
            Logger.error('Failed to process minted nft event!');
        }
    }

    private async processNftGeneratedEvent(contractEvent: any) {
        Logger.log('Got NFT generated event, processing...');
        if (this.checkEventEmitted(contractEvent)) {
            // TODO do something
            Logger.log('NFT generated event processed !');
        } else {
            Logger.error('Failed to process generated nft event!');
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