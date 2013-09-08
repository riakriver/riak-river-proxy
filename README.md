This module provides two services. The actual http proxy server and the
Admin API to CRUD clusters in the Redis store.

riak-river-proxy
================

Proxy point for clients. Handles authentication and load balancing to client riak clusters.

Authentication
--------------

Clients will set a `Authorization: 830ee0f1de5868c949809fa6cbe3595a120b79e9`
header in requests. This will be check against the specific cluster
defined in the `X-Cluster-Id: cluster12345` which also must be set in
the client request headers.

###Error Responses

* 400 - a cluster id wasn't provided
* 401 - a valid authorization value wasn't provied
* 404 - the cluster id did not exist

riak-river-proxy-api
====================

Authentication
--------------
Client will set a `Authorization: 6e41c5a19b9646fe31c77ed7a16829913888c33e` header
in requests.

API
---

###GET /clusters

Returns a list of all clusters

###POST /clusters

Takes POST body to create a new cluster. Requires a Cluster Owner Id
that ties the cluster to the Id.

###GET /clusters/:id

Returns a specific cluster by `id`

###DELETE /clusters/:id

Deletes a specific cluster by `id`

###PUT /clusters/:id

Updates a cluster based on the PUT body


##Status codes

If the API results in success, a `200` will be returned.

If a request fails to pass the correct Authorization information a `401`
will be returned.

If a request fails due to insufficient parameters a `404` will be
returned.

