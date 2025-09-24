FROM golang:1.24.7

WORKDIR /app

COPY . .

RUN cp .env.example .env


RUN go build -mod=vendor -o main ./cmd/main.go

EXPOSE 8080

CMD ["./main"]
