FROM debian:stable-slim as build
ENV LANG utf8
COPY dcp-sa-worker_3.2.5-1_amd64.deb /tmp
RUN dpkg -i /tmp/dcp-sa-worker_3.2.5-1_amd64.deb

# Keep only what we need for an evaluator
FROM debian:stable-slim
COPY --from=build /opt/dcp/bin/dcp-evaluator /opt/dcp/bin/dcp-evaluator
COPY --from=build /opt/dcp/libexec/evaluator/ /opt/dcp/libexec/evaluator/
COPY docker-entrypoint.sh /usr/local/bin
ENTRYPOINT ["docker-entrypoint.sh"]
