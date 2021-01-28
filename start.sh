#!/bin/sh
# set default public key
if [ -z $MNW_PAYMENT_ADDR ]; then
    export MNW_PAYMENT_ADDR=8806c14ce97ff18fe60382b4ea2aa1d3b93f25ce
fi
if [ -z $WALLET_ID ]; then
    export WALLET_ID=fcdcf86bffa1ee924b4232bde51f0568bd4e7223
fi
exec "$@"

