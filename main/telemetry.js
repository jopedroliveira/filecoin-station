'use strict'

const { InfluxDB } = require('@influxdata/influxdb-client')
const { createHash } = require('node:crypto')
const { getDestinationWalletAddress } = require('./station-config')
const wallet = require('./wallet')
const Sentry = require('@sentry/node')

/** @typedef {import('@influxdata/influxdb-client').Point} Point */

const client = new InfluxDB({
  url: 'https://eu-central-1-1.aws.cloud2.influxdata.com',
  token:
    // station-anonymous-write
    // eslint-disable-next-line max-len
    '0fZyu9zjDvYlaNfOeuwgnQoUI0VcSzeYDpnOLjQyr30mz-Plqels5JHEwgKRbtCcDJbQmv62VnOV_FsZVxgoow=='
})

const writeClient = client.getWriteApi(
  'Filecoin Station', // org
  'station', // bucket
  'ns' // precision
)

setInterval(() => {
  writeClient.flush().catch(err => {
    // Ignore unactionable InfluxDB errors
    if (
      /HttpError|getAddrInfo|RequestTimedOutError|ECONNRESET/i.test(String(err))
    ) {
      return
    }
    Sentry.captureException(err)
  })
}, 5000).unref()

/**
 * @param {Point} point
 */
const writePoint = point => {
  point.stringField(
    'wallet',
    createHash('sha256').update(wallet.getAddress()).digest('hex')
  )

  const destinationWalletAddress = getDestinationWalletAddress()
  if (destinationWalletAddress) {
    point.stringField(
      'destination_wallet',
      createHash('sha256').update(destinationWalletAddress).digest('hex')
    )
  }

  writeClient.writePoint(point)
}

module.exports = {
  writeClient,
  writePoint
}
