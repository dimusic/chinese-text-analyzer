use leptos::*;

mod components;
mod pages;

use pages::{MainPage, MainPageProps};

#[component]
pub fn App(cx: Scope) -> impl IntoView {
    view! {
        cx,
        <MainPage />
    }
}
