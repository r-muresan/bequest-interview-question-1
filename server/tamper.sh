#!/bin/sh

curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{ "data": "foo" }' \
  http://localhost:8080/
