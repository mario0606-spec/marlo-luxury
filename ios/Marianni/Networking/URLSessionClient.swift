import Foundation

/// Default API client: URLSession + async/await + Codable.
///
/// Holds a reference to an `AuthTokenProvider` so it can attach a Bearer token
/// and trigger silent refresh on 401. The provider is decoupled from the
/// client so tests can inject a fake.
public actor URLSessionClient: Client {
    private let baseURL: URL
    private let session: URLSession
    private let decoder: JSONDecoder
    private let tokenProvider: AuthTokenProvider?

    public init(
        environment: APIEnvironment = .resolve(),
        bundle: Bundle = .main,
        session: URLSession = .shared,
        tokenProvider: AuthTokenProvider? = nil
    ) {
        self.baseURL = environment.effectiveBaseURL(bundle: bundle)
        self.session = session
        self.tokenProvider = tokenProvider

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        self.decoder = decoder
    }

    public init(baseURL: URL, session: URLSession = .shared, tokenProvider: AuthTokenProvider? = nil) {
        self.baseURL = baseURL
        self.session = session
        self.tokenProvider = tokenProvider

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        self.decoder = decoder
    }

    // MARK: - Public Client conformance

    public func fetchItems(query: ItemQuery) async throws -> CatalogPage {
        try await send(
            Request(method: .get, path: "/api/items", queryItems: query.urlQueryItems)
        )
    }

    public func fetchItem(slug: String) async throws -> CatalogItem? {
        do {
            let item: CatalogItem = try await send(
                Request(method: .get, path: "/api/items/\(slug)")
            )
            return item
        } catch ClientError.notFound {
            return nil
        }
    }

    public func exchangeHandoffToken(_ token: String) async throws -> SessionCredential {
        try await send(
            Request(
                method: .post,
                path: "/api/auth/mobile/handoff",
                body: ["token": token],
                requiresAuth: false
            )
        )
    }

    public func refreshSession(refreshToken: String) async throws -> SessionCredential {
        try await send(
            Request(
                method: .post,
                path: "/api/auth/mobile/refresh",
                body: ["refreshToken": refreshToken],
                requiresAuth: false
            )
        )
    }

    // MARK: - Request plumbing

    enum Method: String { case get = "GET", post = "POST", put = "PUT", delete = "DELETE" }

    struct Request {
        let method: Method
        let path: String
        var queryItems: [URLQueryItem] = []
        var body: [String: String]? = nil
        var requiresAuth: Bool = true
    }

    func makeURL(path: String, queryItems: [URLQueryItem]) -> URL? {
        var components = URLComponents(
            url: baseURL.appendingPathComponent(path),
            resolvingAgainstBaseURL: false
        )
        if !queryItems.isEmpty {
            components?.queryItems = queryItems
        }
        return components?.url
    }

    private func send<Response: Decodable>(_ request: Request) async throws -> Response {
        guard let url = makeURL(path: request.path, queryItems: request.queryItems) else {
            throw ClientError.transport("invalid URL for \(request.path)")
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = request.method.rawValue
        urlRequest.setValue("application/json", forHTTPHeaderField: "Accept")

        if let body = request.body {
            urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
            urlRequest.httpBody = try JSONEncoder().encode(body)
        }

        if request.requiresAuth, let provider = tokenProvider,
           let token = await provider.accessToken() {
            urlRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let (data, response): (Data, URLResponse)
        do {
            (data, response) = try await session.data(for: urlRequest)
        } catch {
            throw ClientError.transport(error.localizedDescription)
        }

        guard let http = response as? HTTPURLResponse else {
            throw ClientError.transport("non-HTTP response")
        }

        switch http.statusCode {
        case 200..<300:
            do {
                return try decoder.decode(Response.self, from: data)
            } catch {
                throw ClientError.decoding(String(describing: error))
            }
        case 401:
            throw ClientError.unauthorized
        case 404:
            throw ClientError.notFound
        default:
            let message = String(data: data, encoding: .utf8)
            throw ClientError.server(status: http.statusCode, message: message)
        }
    }
}

/// Indirection so the network client can ask "what's the current bearer token?"
/// without depending on the auth session type directly. `AuthSession` adopts
/// this in `Auth/AuthSession.swift`.
public protocol AuthTokenProvider: Sendable {
    func accessToken() async -> String?
}
