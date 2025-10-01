Rails.application.config.session_store :cookie_store,
                                                       key: '_todo_app_session',
                                                       domain: :all,
                                                       same_site: :lax,
                                                       secure: false
